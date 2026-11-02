// Structured output schema checker + tool converter UI.
import { checkSchema, fixSchema, extractSchema } from "./schema/check.js";
import { validate } from "./schema/validate.js";
import { parseTools, toFormat } from "./schema/convert.js";
import { copyText } from "./shared/copy.js";
import { readHash, writeHash } from "./shared/share.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "structured-output-schema-checker";
const $ = (id) => document.getElementById(id);
const data = JSON.parse($("sx-rules").textContent);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
let fixedText = "";
let convertedText = "";

function parseJson(text) {
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `Invalid JSON: ${e.message}` };
  }
}

function runCheck() {
  const target = $("sx-target").value;
  const parsed = parseJson($("sx-schema").value);
  const summary = $("sx-summary");
  if (parsed.error) {
    summary.className = "tool-draft";
    summary.textContent = parsed.error;
    $("sx-findings").innerHTML = "";
    $("sx-fixed").textContent = "";
    return;
  }
  const schema = extractSchema(parsed.value);
  const findings = checkSchema(schema, target, data.rules);
  const errors = findings.filter((f) => f.rule.severity === "error");
  const label = $("sx-target").options[$("sx-target").selectedIndex].text;
  summary.className = errors.length ? "tool-draft" : "tool-note";
  summary.innerHTML = findings.length
    ? `<strong>${errors.length}</strong> error${errors.length === 1 ? "" : "s"} and <strong>${findings.length - errors.length}</strong> warning${findings.length - errors.length === 1 ? "" : "s"} for ${esc(label)}.`
    : `No problems found for ${esc(label)}.`;
  $("sx-findings").innerHTML = findings.map(({ rule, issues }) => `
    <li class="ml-finding${rule.severity === "warning" ? " is-behavior" : ""}">
      <div class="ml-meta"><span class="badge ${rule.severity === "error" ? "soon" : "later"}">${rule.severity}</span>${rule.autofix ? '<span class="helptext">auto-fixed below</span>' : '<span class="helptext">fix by hand</span>'}</div>
      <h3>${md(rule.title)}</h3>
      <ul>${issues.slice(0, 8).map((i) => `<li><code>${esc(i.path)}</code> ${esc(i.message)}</li>`).join("")}${issues.length > 8 ? `<li>…and ${issues.length - 8} more</li>` : ""}</ul>
      ${rule.detail ? `<p>${md(rule.detail)}</p>` : ""}
      <blockquote>${md(rule.source.quote)}</blockquote>
      <p class="helptext"><a href="${rule.source.url}" rel="noopener">Official source</a>, checked ${rule.checked}</p>
    </li>`).join("");
  const fixed = fixSchema(schema, findings);
  fixedText = JSON.stringify(fixed, null, 2);
  $("sx-fixed").textContent = fixedText;
  const manual = findings.filter((f) => !f.rule.autofix);
  $("sx-fixed-note").textContent = manual.length ? `Still needs a manual fix: ${manual.map((f) => f.rule.title).join("; ")}.` : findings.length ? "All findings are auto-fixed." : "Nothing to fix.";
  runValidate(schema);
  writeHash({ target: target === "openai" ? "" : target });
}

function runValidate(schema) {
  const out = $("sx-valid");
  const text = $("sx-output").value.trim();
  if (!text) { out.textContent = "Paste a model output to validate it."; out.className = "tool-note"; return; }
  const parsed = parseJson(text);
  if (parsed.error) { out.className = "tool-draft"; out.textContent = parsed.error; return; }
  const errs = validate(schema, parsed.value);
  out.className = errs.length ? "tool-draft" : "tool-note";
  out.innerHTML = errs.length
    ? `<strong>${errs.length} problem${errs.length === 1 ? "" : "s"}:</strong><br>${errs.slice(0, 12).map((e) => `<code>${esc(e.path)}</code> ${esc(e.message)}`).join("<br>")}`
    : "<strong>Valid.</strong> The output matches the schema.";
}

function runConvert() {
  const summary = $("cv-summary");
  const parsed = parseJson($("cv-input").value);
  if (parsed.error) { summary.className = "tool-draft"; summary.textContent = parsed.error; $("cv-output").textContent = ""; return; }
  const { tools, from, errors } = parseTools(parsed.value);
  if (!tools.length) { summary.className = "tool-draft"; summary.textContent = errors[0] || "No tools found."; $("cv-output").textContent = ""; return; }
  const to = $("cv-to").value;
  const { output, warnings } = toFormat(tools, to);
  convertedText = JSON.stringify(output, null, 2);
  $("cv-output").textContent = convertedText;
  const fromLabel = { "openai-responses": "OpenAI Responses / Gemini", "openai-chat": "OpenAI Chat Completions", anthropic: "Anthropic", mcp: "MCP", "gemini-legacy": "Gemini functionDeclarations", mixed: "mixed formats" }[from] || from;
  // Strict tools must also pass the strict schema rules of the new provider.
  const strictTarget = { "openai-responses": "openai", "openai-chat": "openai", anthropic: "anthropic" }[to];
  const strictIssues = strictTarget ? tools.filter((t) => t.strict).flatMap((t) => checkSchema(t.schema, strictTarget, data.rules).filter((f) => f.rule.severity === "error").map((f) => `${t.name}: ${f.rule.title}`)) : [];
  const notes = [...warnings, ...errors, ...strictIssues.map((s) => `strict schema check failed: ${s}`)];
  summary.className = notes.length ? "tool-draft" : "tool-note";
  summary.innerHTML = `Converted ${tools.length} tool${tools.length === 1 ? "" : "s"} from ${esc(fromLabel)}.` + (notes.length ? `<br>${notes.map(md).join("<br>")}` : " Nothing was lost.");
}

// Tabs
const tabs = [...document.querySelectorAll("#sx-app [role=tab]")];
const panels = [...document.querySelectorAll("#sx-app .sx-panel")];
function show(key) {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === key)));
  panels.forEach((p) => { p.hidden = p.dataset.tab !== key; });
  writeHash({ tab: key === "check" ? "" : key });
}
tabs.forEach((t) => t.addEventListener("click", () => { trackUsedOnce(TOOL); show(t.dataset.tab); }));

let timer;
const debounce = (fn) => () => { trackUsedOnce(TOOL); clearTimeout(timer); timer = setTimeout(fn, 200); };
$("sx-schema").addEventListener("input", debounce(runCheck));
$("sx-target").addEventListener("change", runCheck);
$("sx-output").addEventListener("input", debounce(runCheck));
$("cv-input").addEventListener("input", debounce(runConvert));
$("cv-to").addEventListener("change", runConvert);
$("sx-copy-fixed").addEventListener("click", (e) => { copyText(fixedText, e.currentTarget); track("copy", { tool: TOOL, what: "schema" }); });
$("cv-copy").addEventListener("click", (e) => { copyText(convertedText, e.currentTarget); track("copy", { tool: TOOL, what: "tools" }); });

const h = readHash();
if (h.target && [...$("sx-target").options].some((o) => o.value === h.target)) $("sx-target").value = h.target;
runCheck();
runConvert();
show(h.tab === "convert" ? "convert" : "check");
