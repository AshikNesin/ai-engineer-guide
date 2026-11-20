// Reasoning prefix checker UI: 3 tabs (prefix check, model switch, decode).
// All logic lives in reasoning/*.js (unit-tested). Nothing pasted leaves the
// page: no fetch, no storage, no user content in the URL or analytics.
import { parseRequest, parseLog, detectApi } from "./reasoning/detect.js";
import { compare, verdict, defaultTargets, worstBucket, chooseFix, stopgap, switchHandOff, OUTCOMES } from "./reasoning/verdict.js";
import { switchCheck, providerOf, anthropicModel } from "./reasoning/switch.js";
import { readPaste, decodeEntries, summaryLine, recognizeError } from "./reasoning/decode.js";
import { markdownReport, sourceUrl } from "./reasoning/report.js";
import { wordDiff, preview } from "./reasoning/canon.js";
import { copyText } from "./shared/copy.js";
import { readHash, writeHash } from "./shared/share.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "reasoning-prefix-checker";
const $ = (id) => document.getElementById(id);
const rules = JSON.parse($("rp-rules").textContent);
const fixtures = JSON.parse($("rp-fixtures").textContent);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const label = (id) => {
  const m = rules.anthropic.models.find((x) => x.id === id) || rules.openai.models.find((x) => x.id === id);
  return m ? m.label : id;
};
const pretty = (v) => JSON.stringify(v, null, 2);
const fixById = (id) => rules.fixes.find((f) => f.id === id);

// ---------------------------------------------------------------- tabs
const app = $("rp-app");
const tabs = [...app.querySelectorAll('[role="tab"]')];
function selectTab(id, push = true) {
  tabs.forEach((t) => {
    const on = t.id === `rp-tab-${id}`;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    $(t.getAttribute("aria-controls")).hidden = !on;
  });
  app.dataset.tab = id;
  if (push) {
    const t = $(`rp-tab-${id}`);
    const hash = id === "switch" ? location.hash : "";
    history.replaceState(null, "", t.dataset.url + hash);
  }
  if (id === "switch") runSwitch();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t.id.replace("rp-tab-", "")));
  t.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const next = tabs[(i + d + tabs.length) % tabs.length];
    next.focus();
    next.click();
  });
});

// ---------------------------------------------------------------- tab 1
const A = $("rp-a");
const B = $("rp-b");
const logBox = $("rp-log");
const apiSel = $("rp-api");
const behaviorSel = $("rp-behavior");
const batch = $("rp-batch");
const oldAcct = $("rp-oldacct");
const targetBoxes = () => [...document.querySelectorAll('input[name="rp-target"]')];
let userTargets = false;
let lastReport = "";
let lastFixSnippet = "";
let lastPair = null;

function loadPrefixExample(id, note) {
  const fx = fixtures[id];
  if (!fx || !fx.a) return;
  $("rp-logmode").checked = false;
  toggleLog();
  A.value = pretty(fx.a);
  B.value = pretty(fx.b);
  apiSel.value = "";
  behaviorSel.value = "auto";
  batch.checked = !!(fx.options && fx.options.batch);
  userTargets = false;
  const n = $("rp-example-note");
  n.hidden = !note;
  n.textContent = note || "";
  runPrefix();
}

function toggleLog() {
  const on = $("rp-logmode").checked;
  $("rp-pair").hidden = on;
  $("rp-log-field").hidden = !on;
}

function setTargets(result) {
  const provider = result.api;
  document.querySelectorAll(".rp-target-group").forEach((g) => { g.hidden = g.dataset.provider !== provider; });
  $("rp-anth-opts").hidden = provider !== "anthropic";
  if (userTargets) return;
  const want = new Set(defaultTargets(result, rules));
  targetBoxes().forEach((b) => { b.checked = want.has(b.value); });
}

function selectedTargets(provider) {
  return targetBoxes().filter((b) => b.checked && b.dataset.provider === provider).map((b) => b.value);
}

function readSide(el, errEl) {
  errEl.textContent = "";
  try { return parseRequest(el.value).body; } catch (err) { errEl.textContent = err.message; return null; }
}

function behaviorOpt() {
  const v = behaviorSel.value;
  return v === "auto" ? undefined : v === "unset" ? null : v;
}

function runPrefix() {
  const banner = $("rp-banner");
  const detail = $("rp-detail");
  $("rp-log-rows").innerHTML = "";
  if ($("rp-logmode").checked) return runLog();
  const a = readSide(A, $("rp-a-err"));
  const b = readSide(B, $("rp-b-err"));
  if (!a || !b) { banner.innerHTML = ""; detail.innerHTML = ""; lastReport = ""; return; }
  const out = evaluate(a, b);
  if (!out) return;
  banner.innerHTML = out.bannerHtml;
  detail.innerHTML = out.detailHtml;
  lastReport = out.report;
  lastPair = { a, b };
  wireDetail(detail);
  track("check_run", { tool: TOOL, tab: "prefix", api: out.result.api, worst: out.worst });
}

function special(result) {
  const s = result.status;
  if (s === "mixed-apis") return "These look like different APIs. Paste two requests to the same API.";
  if (s === "chat-completions") return `${esc(rules.openai.chat_completions_note)} <a href="${rules.sources["o-kp"].url}" rel="noopener">OpenAI: keep the prefix unchanged</a>.`;
  if (s === "gemini") return "Gemini isn't covered yet: we found no Gemini docs about prefix-bound reasoning.";
  if (s === "decision") return 'This is a decision request. Try the <a href="/tools/decision-api-converter/">Decision API converter</a>.';
  if (s === "unknown-api") return "Couldn't tell the API. Pick it in the API list.";
  return null;
}

/** Compare one pair and render. Returns { result, verdicts, bannerHtml, detailHtml, report, worst } or null. */
function evaluate(a, b) {
  const opts = { api: apiSel.value || undefined, behavior: behaviorOpt(), batch: batch.checked };
  const result = compare(a, b, opts, rules);
  const sp = special(result);
  if (sp) {
    $("rp-banner").innerHTML = `<p class="tool-draft">${sp}</p>`;
    $("rp-detail").innerHTML = "";
    lastReport = "";
    return null;
  }
  setTargets(result);
  const targets = selectedTargets(result.api);
  const verdicts = verdict(result, rules, targets.length ? targets : defaultTargets(result, rules), { oldAccount: oldAcct.checked });
  const fix = chooseFix(result, rules);
  const handoff = result.api === "anthropic" ? switchHandOff(result, rules) : null;
  return {
    result, verdicts, worst: worstBucket(verdicts),
    bannerHtml: bannerHtml(result, verdicts),
    detailHtml: detailHtml(result, fix, handoff),
    report: markdownReport({ result, verdicts, fix, rules, labels: Object.fromEntries(Object.keys(verdicts).map((k) => [k, label(k)])) }),
  };
}

function bannerHtml(result, verdicts) {
  const rows = Object.entries(verdicts).sort((x, y) => OUTCOMES[x[1].outcome].rank - OUTCOMES[y[1].outcome].rank);
  const notes = result.notes.filter((n) => n.id === "previous-response-id").map((n) => `<p class="tool-note">${md(n.text)}</p>`).join("");
  return `${notes}<ul class="rp-verdicts">${rows.map(([id, v]) => {
    const o = OUTCOMES[v.outcome];
    return `<li class="rp-v is-${o.cls}"><span class="rp-v-icon" aria-hidden="true">${o.icon}</span><strong>${esc(label(id))}</strong> <span class="rp-v-label">${esc(o.label)}</span><span class="rp-v-why">${md(v.why)}${v.reasons ? ` <code>${v.reasons.join("</code> <code>")}</code>` : ""}</span></li>`;
  }).join("")}</ul>`;
}

function diffHtml(a, b) {
  if (typeof a === "string" && typeof b === "string") {
    const d = wordDiff(a, b);
    const side = (keep) => d.filter((p) => p.op === "eq" || p.op === keep).map((p) => (p.op === "eq" ? esc(p.text) : `<mark class="rp-${p.op}">${esc(p.text)}</mark>`)).join("");
    return `<div class="rp-diff"><div><span class="label">A</span><pre><code>${side("del")}</code></pre></div><div><span class="label">B</span><pre><code>${side("ins")}</code></pre></div></div>`;
  }
  const show = (v) => (v === undefined || v === null ? "(nothing)" : esc(typeof v === "string" ? v : pretty(v)));
  return `<div class="rp-diff"><div><span class="label">A</span><pre><code>${show(a)}</code></pre></div><div><span class="label">B</span><pre><code>${show(b)}</code></pre></div></div>`;
}

function fixHtml(fix, title = "Fix") {
  if (!fix) return "";
  const snippet = fix.snippet ? pretty(fix.snippet) : "";
  const srcs = fix.sources.map((s) => `<blockquote>${md(s.quote)}</blockquote><p class="helptext"><a href="${sourceUrl(s, rules)}" rel="noopener">${esc((rules.sources[s.ref] || {}).title || "Source")}</a>, checked ${fix.checked}</p>`).join("");
  return `<div class="rp-card rp-fix"><h3>${esc(title)}</h3><p>${md(fix.summary)}</p>${fix.header ? `<p class="helptext">Header: <code>${esc(fix.header)}</code></p>` : ""}${snippet ? `<pre><code>${esc(snippet)}</code></pre><button type="button" class="rp-copy-fix" data-snippet="${esc(snippet)}">Copy snippet</button>` : ""}${srcs}</div>`;
}

function detailHtml(result, fix, handoff) {
  const parts = [];
  const fc = result.firstChange;
  const kind = fc && rules.change_kinds.find((k) => k.id === fc.kind);
  if (result.status === "settings-error") {
    parts.push(`<div class="rp-card"><h3>Settings error</h3><p>B sends <code>thinking.block_binding</code> with thinking <code>${esc(result.settings.thinkingType)}</code>. ${md(rules.anthropic.settings.sources[0].quote)}</p></div>`);
  } else if (result.status === "no-thinking") {
    parts.push(`<div class="rp-card"><h3>Nothing to check</h3><p>B sends no thinking blocks or reasoning items back, so the prefix check has nothing to check. Code that sends no thinking back also loses that reasoning, with no error.</p></div>`);
  }
  if (fc) {
    parts.push(`<div class="rp-card"><h3>First change: ${esc(kind ? kind.label : fc.kind)}</h3>
      <p>${md(fc.detail)}${fc.confirmed === false ? ' <span class="badge later">may count (unconfirmed)</span>' : ""}${fc.viaGuide ? ' <span class="badge later">per OpenAI\'s keep-prefix-unchanged guide</span>' : ""}</p>
      <p class="helptext">In A: <code>${esc(fc.pathA || "—")}</code> · In B: <code>${esc(fc.pathB || "—")}</code></p>
      ${fc.kind === "thinking-gap" ? "" : diffHtml(fc.a, fc.b)}</div>`);
  } else if (result.status === "ok") {
    parts.push(`<div class="rp-card"><h3>No change before any thinking</h3><p>B keeps everything A sent and only adds at the end. That's the append-only pattern both providers ask for.</p></div>`);
  }
  if (result.blocks && result.blocks.length) {
    parts.push(`<div class="rp-card"><h3>${result.api === "openai" ? "Reasoning items" : "Thinking blocks"} in B</h3><div class="tool-table-wrap"><table class="tool-table stack" style="--cols:2"><thead><tr><th>Path</th><th>Type</th><th>Status</th></tr></thead><tbody>${result.blocks.map((b) => {
      const inv = result.invalidPaths.includes(b.path);
      const st = !b.aEra ? "not checked (produced after A's response)" : inv ? "after the change: invalid" : b.unconfirmed ? "after a change that may count" : "valid";
      return `<tr><td class="full"><code>${esc(b.path)}</code>${b.id ? ` <code>${esc(b.id)}</code>` : ""}</td><td data-label="Type">${esc(b.type)}${b.empty ? " (empty text)" : ""}</td><td data-label="Status"><span class="badge ${inv ? "soon" : b.unconfirmed ? "later" : b.aEra ? "far" : ""}">${st}</span></td></tr>`;
    }).join("")}</tbody></table></div>${result.api === "anthropic" ? '<p class="helptext">Paths count every message separately, the same as <code>input_transformations</code>.</p>' : ""}</div>`);
  }
  if (fix) parts.push(fixHtml(fix));
  if (fix && fix.also) fix.also.forEach((id) => { const f = fixById(id); if (f) parts.push(fixHtml(f, "Also works")); });
  const sg = (fc || result.status === "settings-error") ? stopgap(result, rules) : null;
  if (sg && (!fix || sg.id !== fix.id)) parts.push(fixHtml(sg, "Stopgap"));
  if (result.changes && result.changes.length > 1) parts.push(`<div class="rp-card"><h3>Other changes</h3><ul>${result.changes.slice(1).map((c) => `<li>${md(c.detail)}</li>`).join("")}</ul></div>`);
  const info = result.notes.filter((n) => n.id !== "previous-response-id");
  if (info.length) parts.push(`<div class="rp-card"><h3>Notes</h3><ul>${info.map((n) => `<li>${md(n.text)}${n.url ? ` <a href="${n.url}" rel="noopener">Docs</a>` : n.ref ? ` <a href="${rules.sources[n.ref].url}" rel="noopener">Source</a>` : ""}</li>`).join("")}</ul></div>`);
  if (result.notCompared && result.notCompared.length) {
    const sw = handoff ? `<p>The model changed from <code>${esc(handoff.from)}</code> to <code>${esc(handoff.to)}</code>: ${esc(handoff.why)} <a href="#" class="rp-to-switch" data-from="${esc(handoff.from)}" data-to="${esc(handoff.to)}">Open the model-switch tab</a>.</p>` : "";
    parts.push(`<div class="rp-card"><h3>Not compared</h3><p>These differ, but they never count for the prefix check:</p><ul>${result.notCompared.map((n) => `<li><code>${esc(n.field)}</code>${n.detail ? `: ${esc(n.detail)}` : ""}</li>`).join("")}</ul>${sw}</div>`);
  }
  return parts.join("");
}

function wireDetail(root) {
  root.querySelectorAll(".rp-copy-fix").forEach((btn) => btn.addEventListener("click", (e) => { copyText(btn.dataset.snippet, e.currentTarget); track("copy", { tool: TOOL, what: "fix" }); }));
  root.querySelectorAll(".rp-to-switch").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); fromRequests({ a: { model: a.dataset.from }, b: { model: a.dataset.to } }); selectTab("switch"); }));
}

function runLog() {
  const err = $("rp-log-err");
  err.textContent = "";
  let list;
  try { list = parseLog(logBox.value); } catch (e) { err.textContent = e.message; $("rp-banner").innerHTML = ""; $("rp-detail").innerHTML = ""; return; }
  if (list.length < 2) { err.textContent = "Paste at least two requests."; return; }
  const rows = [];
  let firstBad = -1;
  const reports = [];
  for (let i = 1; i < list.length; i += 1) {
    const out = evaluate(list[i - 1], list[i]);
    if (!out) return;
    rows.push(out);
    reports.push(`## Pair ${i} → ${i + 1}\n\n${out.report}`);
    if (firstBad < 0 && OUTCOMES[out.worst] && OUTCOMES[out.worst].rank < 5 && out.worst !== "unknown") firstBad = i - 1;
  }
  $("rp-banner").innerHTML = `<p class="tool-note">${rows.length} consecutive pairs checked.${firstBad >= 0 ? ` The first problem is at request ${firstBad + 1} → ${firstBad + 2}.` : " No problems found."}</p>`;
  $("rp-detail").innerHTML = "";
  $("rp-log-rows").innerHTML = rows.map((o, i) => `<details class="rp-pair"${i === Math.max(firstBad, 0) ? " open" : ""}><summary>Request ${i + 1} → ${i + 2}: ${OUTCOMES[o.worst === "dropped" ? "dropped" : o.worst].icon} ${esc(OUTCOMES[o.worst === "dropped" ? "dropped" : o.worst].label)}${o.result.firstChange ? ` · ${esc(o.result.firstChange.detail)}` : ""}</summary>${o.bannerHtml}${o.detailHtml}</details>`).join("");
  wireDetail($("rp-log-rows"));
  lastReport = reports.join("\n\n");
  track("check_run", { tool: TOOL, tab: "prefix", api: rows[0].result.api, worst: rows.map((o) => o.worst).sort((x, y) => OUTCOMES[x].rank - OUTCOMES[y].rank)[0] });
}

let t1;
const onEdit1 = () => { trackUsedOnce(TOOL); $("rp-example-note").hidden = true; clearTimeout(t1); t1 = setTimeout(runPrefix, 250); };
[A, B, logBox].forEach((el) => el.addEventListener("input", onEdit1));
[apiSel, behaviorSel, batch, oldAcct].forEach((el) => el.addEventListener("change", onEdit1));
$("rp-logmode").addEventListener("change", () => { toggleLog(); runPrefix(); });
document.querySelector(".rp-targets").addEventListener("change", () => { userTargets = true; onEdit1(); });
$("rp-example").addEventListener("change", (e) => {
  const id = e.target.value;
  if (!id) return;
  loadPrefixExample(id, "Example loaded: edit or paste your own.");
  track("example_loaded", { tool: TOOL, example_id: id });
});
$("rp-copy-report").addEventListener("click", (e) => { copyText(lastReport, e.currentTarget); track("copy", { tool: TOOL, what: "report" }); });
$("rp-download-report").addEventListener("click", () => {
  if (!lastReport) return;
  const url = URL.createObjectURL(new Blob([lastReport], { type: "text/markdown" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "reasoning-prefix-check.md";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  track("copy", { tool: TOOL, what: "report" });
});

// ---------------------------------------------------------------- tab 2
let fromModels = [];
const toSel = $("rs-to");
function chips() {
  $("rs-chips").innerHTML = fromModels.length
    ? fromModels.map((m, i) => `<span class="rs-chip">${esc(label(m))}<button type="button" data-i="${i}" aria-label="Remove ${esc(label(m))}">×</button></span>`).join(' <span aria-hidden="true">→</span> ')
    : '<span class="helptext">Add the models this conversation used, oldest first.</span>';
  $("rs-chips").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { fromModels.splice(Number(b.dataset.i), 1); chips(); runSwitch(); }));
}
const CAVEAT_TEXT = {
  "no-error": ["anthropic", "no-error"], "keep-history": ["anthropic", "keep-history"], "thinking-adaptive": ["anthropic", "thinking-adaptive"],
  "system-messages": ["anthropic", "system-messages"], refusal: ["anthropic", "refusal"], "other-provider-turn": ["anthropic", "other-provider-turn"],
  "turn-boundary": ["openai", "turn-boundary"], "all-turns-unconfirmed": ["openai", "all-turns-unconfirmed"], "context-default-unconfirmed": ["openai", "context-default-unconfirmed"],
};
const RESULT_LABEL = { reads: ["far", "reads them"], dropped: ["soon", "dropped"], unknown: ["", "unknown: the docs don't list this pair"], depends: ["later", "depends on capability order (unconfirmed)"] };
function runSwitch() {
  const to = toSel.value;
  const prov = providerOf(to);
  $("rs-platform-field").hidden = prov !== "anthropic";
  $("rs-context-field").hidden = prov !== "openai";
  const opts = { platform: $("rs-platform").value, accountSwitch: $("rs-acct").checked, refusalFallback: $("rs-refusal").checked, reasoningContext: $("rs-context").value };
  const out = $("rs-out");
  document.querySelectorAll("#rs-matrix .is-selected").forEach((el) => el.classList.remove("is-selected"));
  if (!fromModels.length) { out.innerHTML = '<p class="tool-note">Add at least one model the conversation used.</p>'; return; }
  const res = switchCheck(fromModels, to, opts, rules);
  const rows = res.rows.map((r) => {
    const [cls, txt] = RESULT_LABEL[r.result];
    const extra = r.result === "dropped" && providerOf(to) === "anthropic" && r.reason !== "different-provider" ? " (not billed, no error)" : "";
    return `<li class="rs-row"><span>Blocks from <strong>${esc(label(r.from))}</strong> → <strong>${esc(label(r.to))}</strong>:</span> <span class="badge ${cls}">${esc(txt)}${extra}</span>${r.reason && r.reason !== "different-provider" ? ` <code>${esc(r.reason)}</code>` : ""}<br><span class="helptext">${esc(r.why)}</span></li>`;
  }).join("");
  const cav = res.caveats.map((c) => {
    const [p, k] = CAVEAT_TEXT[c] || [];
    const s = p && rules[p].caveats[k];
    if (!s) return "";
    return `<li>${md(s.quote)} <a href="${sourceUrl(s, rules)}" rel="noopener">Source</a></li>`;
  }).join("");
  const accountNote = $("rs-acct").checked && prov === "anthropic" ? `<li>${md(rules.anthropic.caveats["account-bound"].quote)} What counts as your account: ${rules.anthropic.accounts.map((a) => `${esc(a.where)}: ${esc(a.account)}`).join("; ")}.</li>` : "";
  const back = fromModels.filter((m) => m !== to && providerOf(m) === "anthropic").slice(-1)[0];
  const backLine = back && prov === "anthropic" ? `<p>Switching back later? Back on ${esc(label(back))}, its blocks are read again if your code kept them.</p>` : "";
  out.innerHTML = `<ul class="rs-rows">${rows}</ul>${cav || accountNote ? `<h3>Caveats</h3><ul class="rs-caveats">${accountNote}${cav}</ul>` : ""}${backLine}`;
  // Highlight the selected pairs in the static table.
  const toM = anthropicModel(to, rules);
  fromModels.forEach((f) => {
    const fm = anthropicModel(f, rules);
    if (!fm || !toM) return;
    const cell = document.querySelector(`#rs-matrix tr[data-from="${fm.group}"] td[data-to="${toM.group}"]`);
    if (cell) cell.classList.add("is-selected");
  });
  writeHash({ from: fromModels.join(","), to, p: $("rs-platform").value !== "claude-api" ? $("rs-platform").value : "", ctx: $("rs-context").value !== "auto" ? $("rs-context").value : "", acct: $("rs-acct").checked ? "1" : "", fb: $("rs-refusal").checked ? "1" : "" });
}
function addModel(id) {
  const v = String(id || "").trim();
  if (!v || !MODEL_ID.test(v)) return;
  fromModels.push(v);
  chips();
  runSwitch();
  trackUsedOnce(TOOL);
  track("check_run", { tool: TOOL, tab: "switch", api: providerOf(v) || "unknown", worst: "unknown" });
}
function ensureOption(sel, id) {
  if (![...sel.options].some((o) => o.value === id)) sel.add(new Option(`${id} (not in our data)`, id));
  sel.value = id;
}
// Models from a pair of requests (default: the last pair in tab 1). Only valid IDs reach the hash.
const MODEL_ID = /^[A-Za-z0-9._:-]{1,80}$/;
function fromRequests(pair = lastPair) {
  const a = pair && pair.a;
  const b = pair && pair.b;
  if (!a || !b) return;
  if (typeof a.model === "string" && MODEL_ID.test(a.model)) fromModels = [a.model];
  if (typeof b.model === "string" && MODEL_ID.test(b.model)) ensureOption(toSel, b.model);
  chips();
  runSwitch();
}
$("rs-add-btn").addEventListener("click", () => addModel($("rs-add").value));
$("rs-free").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); addModel(e.target.value); e.target.value = ""; } });
[toSel, $("rs-platform"), $("rs-context"), $("rs-acct"), $("rs-refusal")].forEach((el) => el.addEventListener("change", () => { trackUsedOnce(TOOL); runSwitch(); }));
$("rs-from-requests").addEventListener("click", () => fromRequests());
$("rs-share").addEventListener("click", (e) => { copyText(location.href, e.currentTarget); track("copy", { tool: TOOL, what: "link" }); });

// ---------------------------------------------------------------- tab 3
const rdIn = $("rd-input");
const rdReq = $("rd-request");
function runDecode() {
  const out = $("rd-out");
  $("rd-input-err").textContent = "";
  $("rd-request-err").textContent = "";
  if (!rdIn.value.trim()) { out.innerHTML = ""; return; }
  let paste;
  try { paste = readPaste(rdIn.value); } catch (e) { $("rd-input-err").textContent = e.message; out.innerHTML = ""; return; }
  let request = null;
  if (rdReq.value.trim()) {
    try { request = parseRequest(rdReq.value).body; } catch (e) { $("rd-request-err").textContent = e.message; }
  }
  if (paste.kind === "error") {
    out.innerHTML = errorHtml(recognizeError(paste.error, rules, request));
    track("check_run", { tool: TOOL, tab: "decode", api: "anthropic", worst: "400" });
    return;
  }
  const d = decodeEntries(paste, rules, request);
  const rows = d.rows.map((r) => {
    const e = r.entry;
    const where = e.path ? `<code>${esc(e.path)}</code>` : e.id ? `<code>${esc(e.id)}</code>` : "";
    if (!r.known) {
      return `<tr><td class="full">${where}</td><td data-label="Entry"><code>${esc(e.type)}</code> <code>${esc(e.reason)}</code></td><td data-label="Meaning" class="full">Unknown entry. Anthropic's docs say: "Ignore an entry whose <code>type</code> or <code>reason</code> you don't recognize." <pre><code>${esc(pretty(e))}</code></pre></td><td data-label="Yours to fix?">—</td></tr>`;
    }
    const rs = r.reason;
    const yours = { yes: ["soon", "Yes"], no: ["far", "No (expected)"], "usually-no": ["far", "Usually no"], maybe: ["later", "Maybe"] }[rs.yours];
    const fix = rs.fix ? fixById(rs.fix) : null;
    const res = r.resolved && r.resolved.found ? `<br><span class="helptext">→ ${esc(r.resolved.path)}: ${esc(r.resolved.role || "")} ${esc(r.resolved.type || "")} ${r.resolved.preview ? `“${esc(r.resolved.preview)}”` : ""}${r.resolved.before ? `; message before: ${esc(r.resolved.before)}` : ""}</span>` : r.resolved ? '<br><span class="helptext">Not found in the request you pasted.</span>' : "";
    return `<tr><td class="full">${where}${res}</td><td data-label="Entry">${rs.type ? `<code>${esc(rs.type)}</code> ` : ""}<code>${esc(rs.reason)}</code></td><td data-label="Meaning" class="full">${md(rs.meaning)}${rs.billed ? ' <span class="badge soon">billed</span> Set <code>"error"</code> in tests so failures show up as a 400.' : ""}${fix ? `<br><strong>Fix:</strong> ${md(fix.summary)}` : ""} <a href="/tools/reasoning-prefix-checker/reasons/${rs.id}/">More</a></td><td data-label="Yours to fix?"><span class="badge ${yours[0]}">${yours[1]}</span></td></tr>`;
  }).join("");
  const src = d.source === "message_delta" ? '<p class="helptext">Read from the final <code>message_delta</code> event: after a mid-stream fallback, that one counts.</p>' : "";
  out.innerHTML = `<p class="${d.counts.yours ? "tool-draft" : "tool-note"}">${esc(summaryLine(d.counts))}</p>${src}${rows ? `<div class="tool-table-wrap"><table class="tool-table stack" style="--cols:2"><thead><tr><th>Block</th><th>Entry</th><th>Meaning</th><th>Yours to fix?</th></tr></thead><tbody>${rows}</tbody></table></div>` : ""}`;
  const worst = d.counts.yours ? "dropped" : d.counts.total ? "dropped" : "none";
  track("check_run", { tool: TOOL, tab: "decode", api: paste.provider === "openai" ? "openai" : "anthropic", worst });
}
function errorHtml(r) {
  const m = r.match;
  if (!m) return `<p class="tool-draft">We don't recognize this error. It isn't one of the prefix-check errors in Anthropic's docs.</p>`;
  const page = rules.errors.includes(m) ? `<a href="/tools/reasoning-prefix-checker/errors/${m.id}/">Full explanation</a>` : m.tool ? `<a href="${m.tool}">Check the request in the migration linter</a>` : "";
  const fix = m.fix ? fixById(m.fix) : null;
  const longFix = m.long_term_fix ? fixById(m.long_term_fix) : null;
  const ext = m.external_fix || m.url;
  let path = "";
  if (r.path) {
    path = `<p>The error names <code>${esc(r.path)}</code>.`;
    if (r.mapped && !r.mapped.same) path += ` That's <code>messages[${r.mapped.msg}].content[${r.mapped.block}]</code> in your array <span class="badge later">best guess</span>: the error counts a <code>role: "system"</code> message, or one with the same role as the message before, as part of that earlier message.`;
    else if (r.mapped) path += " It matches the same position in your array.";
    path += " The 400 names only the first invalid block; <code>\"drop_block\"</code> lists every invalid block instead.</p>";
  }
  const also = r.also && r.also.length ? `<p>Also in the message: ${r.also.map((x) => `<a href="/tools/reasoning-prefix-checker/errors/${x.id}/">${esc(x.title)}</a>`).join(", ")}.</p>` : "";
  return `<div class="rp-card"><h3>${esc(m.title)}</h3><p>${md(m.meaning)}</p>${path}${also}<p>${page}${ext ? ` <a href="${ext}" rel="noopener">Official guide</a>` : ""}</p></div>${fixHtml(fix, m.id === "thinking-block-bound-to-a-different-conversation" ? "Stop the errors now" : "Fix")}${fixHtml(longFix, "Long-term fix")}`;
}
let t3;
[rdIn, rdReq].forEach((el) => el.addEventListener("input", () => { trackUsedOnce(TOOL); $("rd-example-note").hidden = true; clearTimeout(t3); t3 = setTimeout(runDecode, 250); }));
function loadDecodeExample(id, note) {
  const fx = fixtures[id];
  if (!fx || !("input" in fx)) return;
  rdIn.value = typeof fx.input === "string" ? fx.input : pretty(fx.input);
  rdReq.value = fx.request ? pretty(fx.request) : "";
  const n = $("rd-example-note");
  n.hidden = !note;
  n.textContent = note || "";
  runDecode();
}
$("rd-example").addEventListener("change", (e) => {
  if (!e.target.value) return;
  loadDecodeExample(e.target.value, "Example loaded: edit or paste your own.");
  track("example_loaded", { tool: TOOL, example_id: e.target.value });
});

// ---------------------------------------------------------------- start
const params = new URLSearchParams(location.search);
const ex = params.get("example");
const fx = ex && Object.prototype.hasOwnProperty.call(fixtures, ex) ? fixtures[ex] : null;
if (fx && fx.a) { selectTab("prefix", false); loadPrefixExample(ex, "Example loaded: edit or paste your own."); $("rp-example").value = rules.examples.some((x) => x.id === ex) ? ex : ""; }
else loadPrefixExample("anth-system-date", "Example loaded: edit or paste your own.");
if (fx && "input" in fx) { selectTab("decode", false); loadDecodeExample(ex, "Example loaded: edit or paste your own."); }
else loadDecodeExample("dec-anth-two-prefix", "Example loaded: edit or paste your own.");
const h = readHash();
const valid = (s) => MODEL_ID.test(s);
fromModels = h.from ? h.from.split(",").filter(valid) : ["claude-fable-5-2"];
if (h.to && valid(h.to)) ensureOption(toSel, h.to); else toSel.value = "claude-opus-5-5";
if (h.p && [...$("rs-platform").options].some((o) => o.value === h.p)) $("rs-platform").value = h.p;
if (h.ctx && [...$("rs-context").options].some((o) => o.value === h.ctx)) $("rs-context").value = h.ctx;
$("rs-acct").checked = h.acct === "1";
$("rs-refusal").checked = h.fb === "1";
chips();
if (app.dataset.tab === "switch") runSwitch();
// Pages for the prefix and decode tabs don't keep a switch hash.
if (app.dataset.tab !== "switch" && location.hash) history.replaceState(null, "", location.pathname + location.search);
