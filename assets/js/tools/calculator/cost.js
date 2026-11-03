// Monthly cost tab: cost per model, pins, share links.
import { requestCost, monthlyCost, BATCH_PROVIDERS } from "../shared/cost.js";
import { fmtMoney, fmtInt } from "../shared/format.js";
import { readHash, writeHash } from "../shared/share.js";
import { copyText } from "../shared/copy.js";
import { makeSortable } from "../shared/table.js";
import { track, trackUsedOnce } from "../shared/track.js";

export function initCost(data) {
  const byId = Object.fromEntries(data.models.map((m) => [m.id, m]));
  const TOOL = "llm-cost-calculator";
  const MAX_PINS = 4;
  const $ = (id) => document.getElementById(id);

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
  // Sort control for narrow screens, where the table header is hidden.
  $("cc-sort").addEventListener("change", (e) => {
    const [key, dir] = e.target.value.split(":");
    sorter.sortBy(key, Number(dir));
  });

}
