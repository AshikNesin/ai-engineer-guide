// Request migration linter UI. All rule logic lives in linter/core.js.
import { parseInput } from "./linter/parse.js";
import { lint, applyFixes, isAutoFixable, readsFirstBlock } from "./linter/core.js";
import { copyText } from "./shared/copy.js";
import { readHash, writeHash } from "./shared/share.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "model-migration-linter";
const $ = (id) => document.getElementById(id);
const rules = JSON.parse($("ml-rules").textContent);
const retiring = JSON.parse($("ml-retiring").textContent);
const input = $("ml-input");
const target = $("ml-target");
const apiSel = $("ml-api");
const version = $("ml-version");
const betas = $("ml-betas");

const STATUS = {
  "400": { label: "Returns 400", cls: "soon" },
  error: { label: "Rejected (docs don't state the status code)", cls: "soon" },
  maybe: { label: "Can return an error", cls: "later" },
  behavior: { label: "Behavior change", cls: "later" },
};
const API_NAMES = { messages: "Anthropic Messages", chat: "OpenAI Chat Completions", responses: "OpenAI Responses" };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// Minimal Markdown for rule text: `code` only.
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

const h = readHash();
if (h.target && [...target.options].some((o) => o.value === h.target)) target.value = h.target;
if (h.api) apiSel.value = h.api;
if (h.v) version.value = h.v;

let userPickedTarget = Boolean(h.target);
let lastReport = "";
let lastFixed = "";

function run() {
  const findingsEl = $("ml-findings");
  const summary = $("ml-summary");
  let parsed;
  try {
    parsed = parseInput(input.value);
  } catch (err) {
    summary.textContent = err.message;
    summary.className = "tool-draft";
    findingsEl.innerHTML = "";
    $("ml-fixed").textContent = "";
    return;
  }
  const api = apiSel.value || parsed.api || "messages";
  const isAnthropic = api === "messages";
  $("ml-version-field").hidden = !isAnthropic;
  $("ml-betas-field").hidden = !isAnthropic;

  // Preselect the official replacement when the pasted model is retiring.
  const info = retiring[parsed.body.model];
  if (!userPickedTarget && info && [...target.options].some((o) => o.value === info.to)) target.value = info.to;

  const opts = {
    rules, target: target.value, api,
    apiVersion: isAnthropic ? version.value : undefined,
    headers: betas.value.split(","), raw: parsed.raw,
  };
  const findings = lint(parsed.body, opts);
  const errors = findings.filter((f) => f.rule.status !== "behavior");
  const readsFirst = target.value.startsWith("claude-sonnet-5-5") && readsFirstBlock(parsed.raw);
  const behaviorCount = findings.length - errors.length + (readsFirst ? 1 : 0);
  const targetLabel = target.options[target.selectedIndex].text;

  const notes = [];
  if (info) {
    const when = info.shutdown ? new Date(info.shutdown + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "a date to be announced";
    const link = info.page ? ` <a href="/tools/model-retirements/${info.slug}/">Details</a>.` : "";
    notes.push(`<code>${esc(parsed.body.model)}</code> ${info.status === "retired" ? "was retired on" : "retires on"} ${when}.${link}`);
  }
  summary.className = errors.length ? "tool-draft" : "tool-note";
  summary.innerHTML = `${notes.join(" ")}${notes.length ? "<br>" : ""}` +
    (findings.length || readsFirst
      ? `<strong>${errors.length} breaking</strong> and <strong>${behaviorCount} behavior</strong> change${errors.length + behaviorCount === 1 ? "" : "s"} for ${esc(targetLabel)} on ${API_NAMES[api]}.`
      : `No known breaking changes for ${esc(targetLabel)} on ${API_NAMES[api]}. Still run your evals before switching traffic.`);

  findingsEl.innerHTML = findings.map(({ rule, paths }) => {
    const st = STATUS[rule.status];
    const provider = rule.provider === "anthropic" ? "Anthropic" : "OpenAI";
    const errBlock = rule.error
      ? `<p class="helptext">Error message (quoted from ${provider}'s docs):</p><pre><code>${esc(rule.error)}</code></pre>`
      : "";
    const src = rule.sources.map((s) => `<blockquote>${md(s.quote)}</blockquote><p class="helptext"><a href="${s.url}" rel="noopener">Official ${provider} source</a>, checked ${rule.checked}</p>`).join("");
    const fixable = isAutoFixable(rule) ? "auto-fixed below" : "fix by hand";
    return `<li class="ml-finding${rule.status === "behavior" ? " is-behavior" : ""}">
      <div class="ml-meta"><span class="badge ${st.cls}">${st.label}</span><span>${paths.map((p) => `<code>${esc(p)}</code>`).join(" ")}</span><span class="helptext">· ${fixable}</span></div>
      <h3>${md(rule.title)}</h3>${errBlock}
      <p><strong>Fix:</strong> ${md(rule.fix)}</p>${src}
      <p><a href="/tools/model-migration-linter/errors/${rule.id}/">More on this rule</a></p></li>`;
  }).join("");

  if (readsFirst) {
    findingsEl.insertAdjacentHTML("beforeend", `<li class="ml-finding is-behavior"><div class="ml-meta"><span class="badge later">Behavior change</span><code>content[0].text</code></div>
      <h3>Read content blocks by type</h3><p>Your code reads <code>content[0].text</code>. Claude Sonnet 5.5 can start a response with a <code>thinking</code> block, so read blocks by <code>type</code> instead.</p>
      <p class="helptext"><a href="https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide#thinking-in-responses" rel="noopener">Official Anthropic source</a></p></li>`);
  }

  const fixed = applyFixes(parsed.body, findings, { target: target.value, api });
  lastFixed = JSON.stringify(fixed, null, 2);
  $("ml-fixed").textContent = lastFixed;
  const manual = findings.filter((f) => !isAutoFixable(f.rule) && f.rule.status !== "behavior");
  $("ml-manual").textContent = manual.length
    ? `Not auto-fixed: ${manual.map((f) => f.rule.title).join("; ")}.`
    : "Breaking fields are fixed; review behavior changes before shipping.";

  lastReport = [
    `# Migration check: ${parsed.body.model || "request"} → ${target.value} (${API_NAMES[api]})`, "",
    ...findings.map(({ rule, paths }) => `- **${rule.title}** (${STATUS[rule.status].label}; ${paths.join(", ")})\n  Fix: ${rule.fix}\n  Source: ${rule.sources[0].url}`),
    "", "Checked with https://aiengineerguide.com/tools/model-migration-linter/",
  ].join("\n");
  writeHash({ target: userPickedTarget ? target.value : "", api: apiSel.value, v: isAnthropic && version.value !== "2023-06-01" ? version.value : "" });
}

let timer;
const onEdit = () => { trackUsedOnce(TOOL); clearTimeout(timer); timer = setTimeout(run, 200); };
input.addEventListener("input", onEdit);
betas.addEventListener("input", onEdit);
[apiSel, version].forEach((el) => el.addEventListener("change", onEdit));
target.addEventListener("change", () => { userPickedTarget = true; onEdit(); });
$("ml-copy-fixed").addEventListener("click", (e) => { copyText(lastFixed, e.currentTarget); track("copy", { tool: TOOL, what: "fixed" }); });
$("ml-copy-report").addEventListener("click", (e) => { copyText(lastReport, e.currentTarget); track("copy", { tool: TOOL, what: "report" }); });

run();
