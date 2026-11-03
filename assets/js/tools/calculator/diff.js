// Old -> new model tab: prices, limits and monthly cost side by side,
// adjusted for Anthropic's documented tokenizer change.
import { requestCost, monthlyCost } from "../shared/cost.js";
import { tokenFactor, pctChange } from "../shared/diff.js";
import { fmtMoney, fmtInt } from "../shared/format.js";
import { readHash, writeHash } from "../shared/share.js";
import { copyText } from "../shared/copy.js";
import { track, trackUsedOnce } from "../shared/track.js";

const TOOL = "llm-cost-calculator";

export function initDiff(data) {
  const $ = (id) => document.getElementById(id);
  const from = $("df-from");
  const to = $("df-to");
  const inputs = { di: $("df-in"), do: $("df-out"), dr: $("df-rpd") };
  const presets = JSON.parse($("df-presets").textContent || "[]") || [];
  const byId = Object.fromEntries(data.models.map((m) => [m.id, m]));
  const order = ["openai", "anthropic", "google", "xai", "deepseek", "mistral"];
  const sorted = [...data.models].sort((a, b) =>
    order.indexOf(a.provider) - order.indexOf(b.provider) || a.name.localeCompare(b.name));
  const options = sorted.map((m) => `<option value="${m.id}">${m.name} (${m.id})</option>`).join("");
  from.innerHTML = options;
  to.innerHTML = options;

  const h = readHash();
  const first = presets[0] || {};
  from.value = byId[h.df] ? h.df : first.from || sorted[0].id;
  to.value = byId[h.dt] ? h.dt : first.to || sorted[1].id;
  for (const [k, el] of Object.entries(inputs)) if (h[k]) el.value = h[k];

  const num = (el) => Math.max(0, Number(el.value) || 0);
  const pct = (p) => (p == null ? "—" : `${p > 0 ? "+" : ""}${(p * 100).toFixed(0)}%`);

  function render() {
    const a = byId[from.value];
    const b = byId[to.value];
    if (!a || !b) return;
    const { factor, known } = tokenFactor(a.tokenizer, b.tokenizer);
    const tin = num(inputs.di);
    const tout = num(inputs.do);
    const perDay = num(inputs.dr);
    const reqA = requestCost(a.price, { input: tin, output: tout });
    const reqB = requestCost(b.price, { input: tin * factor, output: tout * factor });
    const rows = [
      ["Input, $ per 1M tokens", a.price.input, b.price.input, fmtMoney],
      ["Output, $ per 1M tokens", a.price.output, b.price.output, fmtMoney],
      ["Cache read, $ per 1M tokens", a.price.cache_read, b.price.cache_read, fmtMoney],
      ["Context window (tokens)", a.context, b.context, fmtInt],
      ["Max output (tokens)", a.max_output, b.max_output, fmtInt],
      ["Tokens per request", tin + tout, (tin + tout) * factor, fmtInt],
      ["Cost per request", reqA, reqB, fmtMoney],
      ["Cost per month", monthlyCost(reqA, perDay), monthlyCost(reqB, perDay), fmtMoney],
    ];
    $("df-h-old").textContent = a.name;
    $("df-h-new").textContent = b.name;
    $("df-table").tBodies[0].innerHTML = rows.map(([label, x, y, f]) => `
      <tr${label === "Cost per month" ? ' class="is-pinned"' : ""}>
        <td class="full"><strong>${label}</strong></td>
        <td class="num" data-label="${a.name}">${x == null ? "—" : f(x)}</td>
        <td class="num" data-label="${b.name}">${y == null ? "—" : f(y)}</td>
        <td class="num" data-label="Change">${pct(pctChange(x, y))}</td>
      </tr>`).join("");

    const notes = [];
    if (factor !== 1) {
      notes.push(`Token counts are scaled by ${factor.toFixed(2)}x: Anthropic says Claude 4.7 and later models produce about 30% more tokens for the same text (<a href="https://platform.claude.com/docs/en/build-with-claude/token-counting" rel="noopener">token counting docs</a>).`);
    } else if (!known) {
      notes.push("These models use different tokenizers, so the same text will be a different number of tokens. Recount a real prompt in the Token count tab.");
    }
    const preset = presets.find((p) => p.from === a.id);
    if (preset) {
      notes.push(`${a.name} is being retired (<a href="/tools/model-retirements/${preset.slug}/">see its retirement date and migration checklist</a>).`);
    }
    $("df-note").innerHTML = notes.join("<br>");
    $("df-note").hidden = notes.length === 0;
    writeHash({ df: from.value, dt: to.value, di: inputs.di.value, do: inputs.do.value, dr: inputs.dr.value });
  }

  [from, to, ...Object.values(inputs)].forEach((el) => el.addEventListener("input", () => { trackUsedOnce(TOOL); render(); }));
  const preset = $("df-preset");
  if (preset) {
    const sync = () => { preset.value = [...preset.options].some((o) => o.value === `${from.value}|${to.value}`) ? `${from.value}|${to.value}` : ""; };
    preset.addEventListener("change", () => {
      if (!preset.value) return;
      [from.value, to.value] = preset.value.split("|");
      trackUsedOnce(TOOL);
      render();
    });
    [from, to].forEach((el) => el.addEventListener("change", sync));
    sync();
  }
  $("df-share").addEventListener("click", (e) => { copyText(location.href, e.currentTarget); track("copy", { tool: TOOL, what: "share" }); });
  render();
  return { render };
}
