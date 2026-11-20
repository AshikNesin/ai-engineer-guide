// Decision API converter UI: convert a decision request between OpenAI,
// Gemini and System One (Jev/Clef), or turn a classifier schema into
// decision questions. Logic lives in decisions/*.js (unit-tested). Nothing
// pasted leaves the page: no fetch, no storage, no user content in the URL
// or analytics.
import { convert, emit, makeWarner, curl, groupWarnings } from "./decisions/convert.js";
import { migrate } from "./decisions/migrate.js";
import { parseRequest } from "./reasoning/detect.js";
import { copyText } from "./shared/copy.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "decision-api-converter";
const $ = (id) => document.getElementById(id);
const data = JSON.parse($("dc-data").textContent);
const fixtures = JSON.parse($("dc-fixtures").textContent);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const own = (o, k) => !!k && Object.prototype.hasOwnProperty.call(o, k);
const pretty = (v) => JSON.stringify(v, null, 2);
const bucket = (n) => (n === 0 ? "0" : n <= 3 ? "1-3" : "4+");

const app = $("dc-app");
const input = $("dc-in");
const fromSel = $("dc-from");
const toSel = $("dc-to");
const outCode = $("dc-out").querySelector("code");
let mode = app.dataset.mode;
let lastJson = "";
let lastCurl = "";
let ordered = {};

// ---------------------------------------------------------------- mode tabs
const tabs = [...app.querySelectorAll('[role="tab"]')];
function setMode(m, push = true) {
  mode = m;
  app.dataset.mode = m;
  tabs.forEach((t) => {
    const on = t.dataset.mode === m;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
  });
  $("dc-from-field").hidden = m === "migrate";
  $("dc-in-label").textContent = m === "migrate" ? "Classifier schema: JSON Schema, structured-output format, or tool definition" : "Decision request (JSON body)";
  $("dc-out-label").textContent = m === "migrate" ? "Decision request" : "Converted request";
  if (push) history.replaceState(null, "", tabs.find((t) => t.dataset.mode === m).dataset.url);
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => {
    if (t.dataset.mode === mode) return;
    setMode(t.dataset.mode);
    loadExample(t.dataset.mode === "migrate" ? "mig-ticket" : "dec-openai-mixed");
  });
  t.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const next = tabs[(i + d + tabs.length) % tabs.length];
    next.focus();
    next.click();
  });
});

// ---------------------------------------------------------------- run
// JSON, or an SDK call / object literal with literal values; errors carry line and column.
const parseBody = (text) => parseRequest(text).body;

function clearOut(msg) {
  outCode.textContent = msg || "";
  $("dc-warnings").innerHTML = "";
  $("dc-mapping").innerHTML = "";
  $("dc-curl").textContent = "";
  lastJson = "";
  lastCurl = "";
}

function renderWarnings(warnings) {
  const groups = groupWarnings(warnings);
  if (!warnings.length) {
    $("dc-warnings").innerHTML = '<p class="tool-note">No lossy steps. The request converts one to one.</p>';
    return;
  }
  let html = `<h3 class="dc-h">Check before you send (${warnings.length})</h3>`;
  for (const [key, list] of groups) {
    html += `<div class="dc-group"><p class="dc-group-key">${key ? `Question <code>${esc(key)}</code>` : "Whole request"}</p><ul>`;
    for (const w of list) html += `<li>${md(w.message)}${w.sourceUrl ? ` <a href="${esc(w.sourceUrl)}" rel="noopener" target="_blank">Source</a>` : ""}</li>`;
    html += "</ul></div>";
  }
  $("dc-warnings").innerHTML = html;
}

function renderMapping(m) {
  const flags = data.migrate_flags;
  let html = '<h3 class="dc-h">What each field became</h3><div class="tool-table-wrap"><table class="tool-table"><thead><tr><th>Field</th><th>Question</th><th>Type</th><th>Ordered?</th><th>Notes</th></tr></thead><tbody>';
  for (const r of m.mapping) {
    const notes = r.flags.map((f) => md(flags[f] || f));
    if (r.orderable && r.type === "choice") notes.push(md(flags["ordered-available"]));
    const box = r.orderable ? `<input type="checkbox" class="dc-ordered" data-key="${esc(r.key)}" aria-label="Treat ${esc(r.field)} as ordered"${ordered[r.key] ? " checked" : ""}>` : "";
    html += `<tr><td><code>${esc(r.field)}</code></td><td><code>${esc(r.key)}</code></td><td>${esc(r.type)}</td><td>${box}</td><td>${notes.join("<br>")}</td></tr>`;
  }
  for (const r of m.dropped) html += `<tr><td><code>${esc(r.field)}</code></td><td>Dropped</td><td></td><td></td><td>${md(flags[r.flag] || r.flag)}</td></tr>`;
  html += "</tbody></table></div>";
  if (m.keep.length) {
    html += `<p class="tool-note"><strong>Keep these in a generative step:</strong> ${m.keep.map((f) => `<code>${esc(f)}</code>`).join(", ")}. Free text has no decision question. ${data.migrate_sources.map((s) => `<a href="${esc(s.url)}" rel="noopener" target="_blank">“${md(s.quote)}”</a>`)[0]}</p>`;
  }
  $("dc-mapping").innerHTML = html;
  $("dc-mapping").querySelectorAll(".dc-ordered").forEach((b) => b.addEventListener("change", () => {
    ordered[b.dataset.key] = b.checked;
    run();
  }));
}

function run(source = "edit") {
  $("dc-in-err").textContent = "";
  const text = input.value.trim();
  if (!text) { clearOut("Paste a request on the left."); return; }
  let body;
  try { body = parseBody(text); } catch (e) { clearOut(); $("dc-in-err").textContent = e.message; return; }
  const to = toSel.value;
  let result;
  try {
    if (mode === "migrate") {
      const m = migrate(body, { ordered });
      const { list, warn } = makeWarner(data);
      const out = emit(m.ir, to, data, warn);
      result = { body: out, warnings: list, curl: curl(out, to, data), mapping: m };
    } else {
      result = convert(body, fromSel.value || null, to, data);
      if (!fromSel.value) fromSel.querySelector('option[value=""]').textContent = `Detect automatically (${data.formats[result.from].short})`;
    }
  } catch (e) {
    clearOut();
    $("dc-in-err").textContent = e.message;
    return;
  }
  lastJson = pretty(result.body);
  lastCurl = result.curl;
  outCode.textContent = lastJson;
  $("dc-curl").textContent = lastCurl;
  if (result.mapping) renderMapping(result.mapping);
  else $("dc-mapping").innerHTML = "";
  renderWarnings(result.warnings);
  if (source !== "load") track("convert_run", { tool: TOOL, mode, from: result.from || "schema", to, warnings: bucket(result.warnings.length) });
}

let timer;
input.addEventListener("input", () => {
  trackUsedOnce(TOOL);
  $("dc-example-note").hidden = true;
  clearTimeout(timer);
  timer = setTimeout(run, 250);
});
[fromSel, toSel].forEach((el) => el.addEventListener("change", () => { trackUsedOnce(TOOL); run(); }));
$("dc-copy-json").addEventListener("click", (e) => { if (!lastJson) return; copyText(lastJson, e.currentTarget); track("copy", { tool: TOOL, what: "json" }); });
$("dc-copy-curl").addEventListener("click", (e) => { if (!lastCurl) return; copyText(lastCurl, e.currentTarget); track("copy", { tool: TOOL, what: "curl" }); });

// ---------------------------------------------------------------- examples
function loadExample(id, to) {
  const fx = own(fixtures, id) ? fixtures[id] : null;
  if (!fx) return false;
  if (fx.mode !== mode) setMode(fx.mode, false);
  ordered = { ...((fx.options && fx.options.ordered) || {}) };
  input.value = pretty(fx.input);
  fromSel.value = "";
  fromSel.querySelector('option[value=""]').textContent = "Detect automatically";
  toSel.value = to || fx.to || "openai";
  $("dc-example").value = id;
  $("dc-example-note").textContent = `Example: ${fx.label}. Edit it or paste your own.`;
  $("dc-example-note").hidden = false;
  run("load");
  return true;
}
$("dc-example").addEventListener("change", (e) => {
  if (!e.target.value) return;
  const fx = own(fixtures, e.target.value) ? fixtures[e.target.value] : null;
  if (fx && fx.mode !== mode) setMode(fx.mode);
  loadExample(e.target.value);
  track("example_loaded", { tool: TOOL, example_id: e.target.value });
});

// Startup: ?example=<id>&to=<format> (fixture ids only, never user input).
const q = new URLSearchParams(location.search);
const qTo = own(data.formats, q.get("to")) ? q.get("to") : null;
setMode(mode, false);
if (!(q.get("example") && loadExample(q.get("example"), qTo))) {
  loadExample(app.dataset.example, qTo || app.dataset.to || null);
  if (app.dataset.from) { fromSel.value = app.dataset.from; run("load"); }
}
