// Model switches: which earlier models' reasoning the new model can use.
// Rules: data/reasoning_rules.json (anthropic.reads, a-pt; openai, o-rs). Pure.
import { familyOf, modelInfo } from "./openai.js";

const stripDate = (id) => String(id || "").trim().replace(/-\d{8}$/, "");

export function providerOf(id) {
  const s = stripDate(id);
  if (/^claude-/.test(s)) return "anthropic";
  if (/^(gpt-|o\d|chatgpt)/.test(s)) return "openai";
  return null;
}

/** Anthropic model record (or a synthetic one for earlier models), or null. */
export function anthropicModel(id, rules) {
  const s = stripDate(id);
  const m = rules.anthropic.models.find((x) => x.id === s);
  if (m) return m;
  if (new RegExp(rules.anthropic.earlier_pattern).test(s)) return { id: s, label: s, group: "earlier", preserved: false, synthetic: true };
  return null;
}

/** Does a model in `toGroup` read blocks from `fromGroup`? true | false | null (docs don't say). */
export function anthropicReads(fromGroup, toGroup, rules) {
  const a = rules.anthropic;
  if (fromGroup === toGroup) return true;
  const list = a.reads[toGroup];
  if (!list) return fromGroup === "earlier" ? true : null; // "Every Claude model reads blocks from ... earlier"
  if (list.includes(fromGroup)) return true;
  const scope = a.reads_cover[toGroup];
  if (scope === "all" || (Array.isArray(scope) && scope.includes(fromGroup))) return false;
  return null;
}

/**
 * @param {string[]} from models used so far (in order)
 * @param {string} to model you switch to
 * @param {object} opts { platform = "claude-api", accountSwitch, refusalFallback, reasoningContext }
 * @returns {{ rows: [{from, to, result, reason, why}], caveats: string[] }}
 *   result: "reads" | "dropped" | "unknown" | "depends"
 */
export function switchCheck(from, to, opts, rules) {
  const o = { platform: "claude-api", accountSwitch: false, refusalFallback: false, reasoningContext: "auto", ...opts };
  const rows = [];
  const caveats = new Set();
  const toProv = providerOf(to);
  for (const f of from) {
    const fromProv = providerOf(f);
    const row = { from: f, to, result: "unknown", reason: null, why: "" };
    if (!fromProv || !toProv) { row.why = "We don't know this model ID."; rows.push(row); continue; }
    if (fromProv !== toProv) {
      row.result = "dropped"; row.reason = "different-provider";
      row.why = "Different provider: neither provider's docs describe reading the other's reasoning.";
      if (toProv === "anthropic") caveats.add("other-provider-turn");
      rows.push(row); continue;
    }
    if (fromProv === "anthropic") anthropicRow(row, f, to, o, rules, caveats);
    else openaiRow(row, f, to, o, rules, caveats);
    rows.push(row);
  }
  if (toProv === "anthropic") {
    caveats.add("no-error");
    caveats.add("keep-history");
    const t = anthropicModel(to, rules);
    if (t && t.preserved) caveats.add("thinking-adaptive");
    if (t && t.accepts_system_messages === false) caveats.add("system-messages");
    if (o.refusalFallback) caveats.add("refusal");
  }
  return { rows, caveats: [...caveats] };
}

function anthropicRow(row, f, to, o, rules, caveats) {
  const fm = anthropicModel(f, rules);
  const tm = anthropicModel(to, rules);
  if (!fm || !tm) { row.why = "This model isn't in Anthropic's switch tables, so the docs don't list this pair."; return; }
  if (o.accountSwitch && fm.account_bound) {
    row.result = "dropped"; row.reason = "organization_binding_mismatch";
    row.why = `Thinking blocks from ${fm.label} work only in the account that produced them or a linked one.`;
    return;
  }
  if (o.refusalFallback && stripDate(f) !== stripDate(to)) {
    row.result = "dropped"; row.reason = "refusal-fallback";
    row.why = "None of the permitted fallback models can read the refusing model's thinking.";
    return;
  }
  let reads = anthropicReads(fm.group, tm.group, rules);
  // The switch table is for the Claude API. Off it, only what the docs say elsewhere holds.
  if (o.platform !== "claude-api" && fm.group !== tm.group) {
    const note = rules.anthropic.platform_notes.find((n) => n.to_group === tm.group);
    const fromOnly = rules.anthropic.platform_notes.find((n) => n.from_group === fm.group && n.any_platform);
    if (fromOnly && tm.group !== fm.group) reads = false;
    else if (!(note && note.platforms_verified.includes(o.platform))) reads = null;
  }
  if (reads === true) { row.result = "reads"; row.why = `${tm.label} reads blocks from ${fm.label}.`; }
  else if (reads === false) { row.result = "dropped"; row.reason = "model_binding_mismatch"; row.why = `${tm.label} can't read ${fm.label}'s blocks. The API drops them for this request, with no error and no charge.`; }
  else { row.result = "unknown"; row.why = o.platform !== "claude-api" ? "Anthropic's switch table covers the Claude API. The docs don't confirm this pair on this platform." : "The docs don't list this pair."; }
}

function openaiRow(row, f, to, o, rules, caveats) {
  const ff = familyOf(stripDate(f), rules);
  const tf = familyOf(stripDate(to), rules);
  const ti = modelInfo(stripDate(to), rules);
  if (o.accountSwitch) { row.result = "dropped"; row.reason = "organization_mismatch"; row.why = "Reasoning items from another organization are removed."; return; }
  if (ff !== tf) { row.result = "dropped"; row.reason = "model_mismatch"; row.why = `Different model family (${ff} → ${tf}): persisted reasoning is reused only within the same family.`; return; }
  if (stripDate(f) === stripDate(to)) { row.result = "reads"; row.why = "Same model."; }
  else { row.result = "depends"; row.reason = "model_mismatch"; row.why = "Same family: kept if the new model is more capable, dropped if less. OpenAI doesn't publish the order."; }
  // turn_boundary
  const ctx = o.reasoningContext;
  if (ctx === "current_turn") caveats.add("turn-boundary");
  else if (ctx === "all_turns" && ti.all_turns_supported !== true) caveats.add("all-turns-unconfirmed");
  else if (ctx === "auto" && ti.reasoning_context_default !== "all_turns") caveats.add("context-default-unconfirmed");
}
