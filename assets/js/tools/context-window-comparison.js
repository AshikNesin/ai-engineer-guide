// Context window comparison: sortable table plus a "will it fit?" check.
import { estimate } from "./shared/estimate.js";
import { fmtInt } from "./shared/format.js";
import { readHash, writeHash } from "./shared/share.js";
import { copyText } from "./shared/copy.js";
import { makeSortable } from "./shared/table.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "context-window-comparison";
const $ = (id) => document.getElementById(id);
const tokens = $("cw-tokens");
const reserve = $("cw-reserve");
const provider = $("cw-provider");
const paste = $("cw-paste");
const table = $("cw-table");
const rows = [...table.tBodies[0].rows];

const h = readHash();
if (h.t) tokens.value = h.t;
if (h.r) reserve.value = h.r;
if (h.p) provider.value = h.p;

// Exact OpenAI counting needs the big tokenizer, so pasted text uses the
// documented ratios for every model ("o200k"/"cl100k" fall back to chars/4).
function tokensFor(tr) {
  if (paste.value) return estimate(tr.dataset.tokenizer, paste.value);
  return Number(tokens.value) || 0;
}

function apply() {
  const out = Number(reserve.value) || 0;
  const p = provider.value;
  let fit = 0;
  let shown = 0;
  for (const tr of rows) {
    const visible = !p || tr.dataset.provider === p;
    tr.classList.toggle("is-hidden", !visible);
    if (!visible) continue;
    shown += 1;
    const need = tokensFor(tr);
    const ctx = Number(tr.dataset.ctx);
    const maxIn = Number(tr.dataset.maxin) || ctx;
    const maxOut = Number(tr.dataset.maxout) || Infinity;
    const ok = need <= maxIn && need + Math.min(out, maxOut) <= ctx && out <= maxOut;
    tr.classList.toggle("fits", ok && need > 0);
    tr.classList.toggle("no-fit", !ok);
    if (ok) fit += 1;
  }
  const label = paste.value ? "your pasted text (estimated per model)" : `${fmtInt(Number(tokens.value) || 0)} input tokens`;
  $("cw-summary").innerHTML = `<strong>${fit} of ${shown}</strong> models fit ${label} plus ${fmtInt(out)} output tokens.`;
  writeHash({ t: tokens.value, r: reserve.value, p });
}

const sorter = makeSortable(table, (tr, key) => {
  if (key === "name") return tr.querySelector("strong").textContent.toLowerCase();
  if (key === "released") return tr.dataset.released || null;
  const v = tr.dataset[key];
  return v ? Number(v) : null;
});

let t;
[tokens, reserve, provider, paste].forEach((el) => el.addEventListener("input", () => {
  trackUsedOnce(TOOL);
  clearTimeout(t);
  t = setTimeout(apply, 120);
}));
$("cw-share").addEventListener("click", (e) => { copyText(location.href, e.currentTarget); track("copy", { tool: TOOL, what: "share" }); });

apply();
sorter.sortBy("ctx", -1);
