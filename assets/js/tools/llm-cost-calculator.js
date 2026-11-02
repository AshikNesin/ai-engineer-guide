// LLM API cost calculator: monthly cost per model, pins, share links, and a
// prompt caching tab. Prices come from data/models.json inlined in the page.
import { requestCost, monthlyCost, cachingCost, BATCH_PROVIDERS } from "./shared/cost.js";
import { fmtMoney, fmtInt } from "./shared/format.js";
import { readHash, writeHash } from "./shared/share.js";
import { copyText } from "./shared/copy.js";
import { makeSortable } from "./shared/table.js";
import { track, trackUsedOnce } from "./shared/track.js";

const TOOL = "llm-cost-calculator";
const MAX_PINS = 4;
const $ = (id) => document.getElementById(id);
const data = JSON.parse($("models-data").textContent);
const byId = Object.fromEntries(data.models.map((m) => [m.id, m]));

const inputs = { i: $("cc-in"), o: $("cc-out"), r: $("cc-rpd"), c: $("cc-cache") };
const batch = $("cc-batch");
const provider = $("cc-provider");
const search = $("cc-search");
const table = $("cc-table");
const rows = [...table.tBodies[0].rows];

const num = (el, max = Infinity) => Math.min(max, Math.max(0, Number(el.value) || 0));

// ---- restore state from the share link -----------------------------------
const h = readHash();
for (const k of Object.keys(inputs)) if (h[k] !== undefined) inputs[k].value = h[k];
if (h.b === "1") batch.checked = true;
if (h.p) provider.value = h.p;
const pinned = new Set((h.pin || "").split(",").filter((id) => byId[id]).slice(0, MAX_PINS));

function compute() {
  const req = { input: num(inputs.i), output: num(inputs.o), cachedShare: num(inputs.c, 100) / 100, batch: batch.checked };
  const perDay = num(inputs.r);
  for (const tr of rows) {
    const m = byId[tr.dataset.id];
    const per = requestCost(m.price, { ...req, provider: m.provider });
    const month = monthlyCost(per, perDay);
    tr.dataset.req = per ?? "";
    tr.dataset.month = month ?? "";
    tr.querySelector('[data-cell="req"]').textContent = per == null ? "n/a" : fmtMoney(per);
    tr.querySelector('[data-cell="month"] strong').textContent = month == null ? "n/a" : fmtMoney(month);
    tr.querySelector('[data-cell="month"]').title =
      per == null && batch.checked && !BATCH_PROVIDERS.has(m.provider) ? "No batch discount listed for this provider" : "";
  }
  filter();
  sorter.resort();
  save();
}

function filter() {
  const p = provider.value;
  const q = search.value.trim().toLowerCase();
  let shown = 0;
  for (const tr of rows) {
    const ok = tr.classList.contains("is-pinned") || ((!p || tr.dataset.provider === p) && (!q || tr.dataset.search.includes(q)));
    tr.classList.toggle("is-hidden", !ok);
    if (ok) shown += 1;
  }
  $("cc-empty").hidden = shown > 0;
}

function save() {
  writeHash({
    i: inputs.i.value, o: inputs.o.value, r: inputs.r.value, c: inputs.c.value === "0" ? "" : inputs.c.value,
    b: batch.checked ? "1" : "", p: provider.value, pin: [...pinned].join(","),
  });
}

const sorter = makeSortable(table, (tr, key) => {
  if (key === "name") return tr.querySelector("strong").textContent.toLowerCase();
  const v = tr.dataset[key];
  return v === "" || v === undefined ? null : Number(v);
});

function syncPins() {
  for (const tr of rows) {
    const on = pinned.has(tr.dataset.id);
    tr.classList.toggle("is-pinned", on);
    const box = tr.querySelector(".cc-pin");
    box.checked = on;
    box.disabled = !on && pinned.size >= MAX_PINS;
  }
}

rows.forEach((tr) => tr.querySelector(".cc-pin").addEventListener("change", (e) => {
  if (e.target.checked) pinned.add(tr.dataset.id);
  else pinned.delete(tr.dataset.id);
  trackUsedOnce(TOOL);
  syncPins();
  compute();
}));

[...Object.values(inputs), batch, provider].forEach((el) => el.addEventListener("input", () => { trackUsedOnce(TOOL); compute(); }));
search.addEventListener("input", () => { trackUsedOnce(TOOL); filter(); });
$("cc-share").addEventListener("click", (e) => { save(); copyText(location.href, e.currentTarget); track("copy", { tool: TOOL, what: "share" }); });
$("cc-unpin").addEventListener("click", () => { pinned.clear(); syncPins(); compute(); });

syncPins();
compute();
sorter.sortBy("month", 1);

// ---- tabs -------------------------------------------------------------------
const tabs = [["cc-tab-cost-btn", "cc-tab-cost"], ["cc-tab-cache-btn", "cc-tab-cache"]];
tabs.forEach(([btnId, panelId]) => $(btnId).addEventListener("click", () => {
  tabs.forEach(([b, p]) => {
    $(b).setAttribute("aria-selected", String(b === btnId));
    $(p).hidden = p !== panelId;
  });
  if (panelId === "cc-tab-cache") trackUsedOnce(TOOL);
}));

// ---- prompt caching tab -------------------------------------------------------
const pcModel = $("pc-model");
const cacheable = data.models.filter((m) => m.price.cache_read != null && m.status !== "deprecated");
pcModel.innerHTML = cacheable
  .map((m) => `<option value="${m.id}">${m.name} (${m.provider})</option>`)
  .join("");
pcModel.value = cacheable.find((m) => m.provider === "anthropic")?.id || cacheable[0]?.id;

function computeCache() {
  const m = byId[pcModel.value];
  if (!m) return;
  const ttl = $("pc-ttl");
  ttl.disabled = m.provider !== "anthropic";
  if (ttl.disabled) ttl.value = "default";
  const r = cachingCost(m.price, {
    prefix: num($("pc-prefix")),
    reads: num($("pc-reads")),
    writeMultiplier: ttl.value === "1h" ? 2 : null,
  });
  const perDay = num($("pc-writes"));
  const pct = r.without > 0 ? (r.savings / r.without) * 100 : 0;
  const premium = ((r.write / m.price.input - 1) * 100).toFixed(0);
  const discount = ((1 - r.read / m.price.input) * 100).toFixed(0);
  $("pc-result").innerHTML = `
    <strong>${m.name}</strong>: write ${fmtMoney(r.write)}/1M (${premium > 0 ? `+${premium}% premium` : "no write premium"}),
    read ${fmtMoney(r.read)}/1M (${discount}% off input).<br>
    Per cached prefix: <strong>${fmtMoney(r.withCache)}</strong> with caching vs ${fmtMoney(r.without)} without
    (${r.savings >= 0 ? "saves" : "costs"} <strong>${fmtMoney(Math.abs(r.savings))}</strong>, ${pct.toFixed(0)}%).<br>
    Per month at ${fmtInt(perDay)} writes/day: <strong>${fmtMoney(r.withCache * perDay * 30)}</strong> vs ${fmtMoney(r.without * perDay * 30)}.<br>
    Break-even: caching pays off after <strong>${r.breakEven == null ? "never" : `${r.breakEven} cache hit${r.breakEven === 1 ? "" : "s"}`}</strong> per write.`;
}
["pc-model", "pc-ttl", "pc-prefix", "pc-reads", "pc-writes"].forEach((id) => $(id).addEventListener("input", computeCache));
computeCache();
