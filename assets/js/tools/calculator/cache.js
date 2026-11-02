// Prompt caching tab: write premium, read discount and break-even.
import { cachingCost } from "../shared/cost.js";
import { fmtMoney, fmtInt } from "../shared/format.js";

export function initCache(data) {
  const $ = (id) => document.getElementById(id);
  const byId = Object.fromEntries(data.models.map((m) => [m.id, m]));
  const num = (el) => Math.max(0, Number(el.value) || 0);
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
}
