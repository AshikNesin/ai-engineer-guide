// Deprecated model-ID scanner UI. Matching logic lives in scanner/core.js.
import { buildIndex, scan, summarize, checklist } from "./scanner/core.js";
import { copyText } from "./shared/copy.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "model-id-scanner";
const $ = (id) => document.getElementById(id);
const index = buildIndex(JSON.parse($("sc-data").textContent));
const input = $("sc-input");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
let rows = [];

function statusCell(r) {
  if (r.model.status === "legacy") return `<span class="badge later">alias, routes to a newer model</span>`;
  if (r.retired) return `<span class="badge retired">retired: requests fail</span>`;
  if (r.days == null) return `<span class="badge later">deprecated, date TBA</span>`;
  const cls = r.days <= 30 ? "soon" : r.days <= 90 ? "later" : "far";
  const est = r.model.shutdown_kind === "earliest" ? " (earliest)" : "";
  return `<span class="badge ${cls}">${r.days === 0 ? "today" : `${r.days} day${r.days === 1 ? "" : "s"} left`}${est}</span>`;
}

function run() {
  rows = summarize(scan(input.value, index));
  const retired = rows.filter((r) => r.retired).length;
  const soon = rows.filter((r) => !r.retired && r.days != null && r.days <= 90).length;
  const refs = rows.reduce((n, r) => n + r.lines.length, 0);
  $("sc-summary").className = rows.length ? "tool-draft" : "tool-note";
  $("sc-summary").innerHTML = rows.length
    ? `Found <strong>${rows.length}</strong> deprecated model ID${rows.length === 1 ? "" : "s"} on ${refs} line${refs === 1 ? "" : "s"}: <strong>${retired}</strong> already retired, <strong>${soon}</strong> shutting down within 90 days.`
    : "No deprecated or retired model IDs found. Models that are still active aren't flagged.";
  $("sc-table").tBodies[0].innerHTML = rows.map((r) => {
    const name = r.model.page ? `<a href="/tools/model-retirements/${r.model.slug}/">${esc(r.model.name)}</a>` : esc(r.model.name);
    const aliasNote = r.match === "alias" ? `<br><span class="helptext">Alias of a retiring snapshot; the official table lists the dated IDs.</span>` : "";
    return `<tr>
      <td class="full" data-label="Model ID"><code>${esc(r.id)}</code> ${name}${aliasNote}</td>
      <td data-label="Status">${statusCell(r)}</td>
      <td class="num" data-label="Shutdown">${r.model.shutdown ? fmtDate(r.model.shutdown) : "TBA"}</td>
      <td data-label="Replacement">${esc(r.model.replacement?.text || "—")}</td>
      <td data-label="Lines">${r.lines.slice(0, 12).join(", ")}${r.lines.length > 12 ? "…" : ""}</td>
    </tr>`;
  }).join("");
}

let timer;
input.addEventListener("input", () => { trackUsedOnce(TOOL); clearTimeout(timer); timer = setTimeout(run, 200); });

async function readFiles(files) {
  const parts = [];
  for (const f of files) {
    if (f.size > 5 * 1024 * 1024) continue;
    parts.push(`// ---- ${f.name}\n${await f.text()}`);
  }
  if (!parts.length) return;
  input.value = parts.join("\n");
  trackUsedOnce(TOOL);
  track("file_loaded", { tool: TOOL });
  run();
}
$("sc-file").addEventListener("change", (e) => readFiles([...e.target.files]));
$("sc-drop").addEventListener("dragover", (e) => e.preventDefault());
$("sc-drop").addEventListener("drop", (e) => { e.preventDefault(); readFiles([...e.dataTransfer.files]); });
$("sc-copy").addEventListener("click", (e) => { copyText(checklist(rows) || "No deprecated model IDs found.", e.currentTarget); track("copy", { tool: TOOL, what: "checklist" }); });
$("sc-clear").addEventListener("click", () => { input.value = ""; run(); input.focus(); });

run();
