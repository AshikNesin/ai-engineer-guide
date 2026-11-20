// Tie the comparison to per-model outcomes. Pure; tested with every fixture.
import { detectApi } from "./detect.js";
import { compareAnthropic } from "./anthropic.js";
import { compareOpenAI, modelInfo } from "./openai.js";
import { anthropicModel, switchCheck } from "./switch.js";

export const OUTCOMES = {
  settings_error: { rank: 0, icon: "🔴", label: "400 error on every model (settings)", cls: "bad" },
  "400": { rank: 1, icon: "🔴", label: "400 error", cls: "bad" },
  possible_400: { rank: 2, icon: "🟠", label: "Possible 400, or stale thinking billed", cls: "warn" },
  dropped: { rank: 3, icon: "🟡", label: "Reasoning dropped, no error", cls: "drop" },
  dropped_not_billed: { rank: 3, icon: "🟡", label: "Dropped, not billed, no error", cls: "drop" },
  no_400: { rank: 3, icon: "🟡", label: "No 400 (batch): dropped, or let through on some models", cls: "drop" },
  unknown: { rank: 4, icon: "⚪", label: "Can't tell", cls: "unknown" },
  none: { rank: 5, icon: "🟢", label: "Nothing happens", cls: "ok" },
};

/** Same summary buckets as the analytics `worst` prop. */
export function worstBucket(verdicts) {
  const list = Object.values(verdicts).map((v) => v.outcome);
  const best = list.sort((a, b) => OUTCOMES[a].rank - OUTCOMES[b].rank)[0];
  if (!best) return "unknown";
  if (best === "settings_error") return "400";
  if (best === "dropped_not_billed" || best === "no_400") return "dropped";
  return best;
}

/** Compare A and B. opts: { api?, behavior?, batch? } */
export function compare(A, B, opts = {}, rules) {
  const apiA = detectApi(A);
  const apiB = detectApi(B);
  const api = opts.api || apiB || apiA;
  if (!opts.api && apiA && apiB && apiA !== apiB) return { api: null, status: "mixed-apis", apis: [apiA, apiB] };
  if (api === "chat") return { api: "chat", status: "chat-completions" };
  if (api === "gemini") return { api: "gemini", status: "gemini" };
  if (api === "decision") return { api: "decision", status: "decision" };
  if (api === "openai") return compareOpenAI(A, B, opts, rules);
  if (api === "anthropic") return compareAnthropic(A, B, opts);
  return { api: null, status: "unknown-api" };
}

/** Default targets: B's model (or A's), plus every model of that provider with preserved thinking. */
export function defaultTargets(result, rules) {
  const own = result.models && (result.models.b || result.models.a);
  if (result.api === "anthropic") {
    const ids = rules.anthropic.models.filter((m) => m.preserved).map((m) => m.id);
    const ownId = own && anthropicModel(own, rules) ? anthropicModel(own, rules).id : null;
    return [...new Set([ownId, ...ids].filter(Boolean))];
  }
  if (result.api === "openai") {
    const ids = rules.openai.models.filter((m) => m.prefix_drop).map((m) => m.id);
    return [...new Set([own, ...ids].filter(Boolean))];
  }
  return [];
}

/** Per-model outcome: { [modelId]: { outcome, why, reasons? } } */
export function verdict(result, rules, targets, opts = {}) {
  const out = {};
  const ids = targets && targets.length ? targets : defaultTargets(result, rules);
  for (const id of ids) {
    out[id] = result.api === "openai" ? openaiVerdict(result, rules, id) : anthropicVerdict(result, rules, id, opts);
  }
  return out;
}

function anthropicVerdict(r, rules, id, opts) {
  const m = anthropicModel(id, rules);
  if (!m) return { outcome: "unknown", why: "This model isn't in our data, so we can't say whether it runs the prefix check." };
  if (r.status === "settings-error") return { outcome: "settings_error", why: "`block_binding` is sent with thinking off (`disabled` or `between_tools`): a 400 error on every model." };
  if (r.status === "compaction-unknown") return { outcome: "unknown", why: "A compaction block appears between A and B." };
  if (r.status === "no-thinking") return { outcome: "unknown", why: "B sends no thinking blocks back, so the prefix check has nothing to check." };
  if (!m.preserved) return { outcome: "none", why: `${m.label} doesn't run the prefix check.` };
  const producer = r.models && r.models.a ? anthropicModel(r.models.a, rules) : null;
  if (producer && !producer.preserved) return { outcome: "none", why: `The blocks came from ${producer.label}, which the prefix check doesn't cover.` };
  if (!r.invalidPaths.length) {
    if (r.unconfirmedPaths && r.unconfirmedPaths.length) return { outcome: "unknown", why: "The only change may or may not count (unconfirmed in the docs)." };
    return { outcome: "none", why: "Nothing before the thinking blocks changed." };
  }
  const b = r.settings.behavior;
  if (b === "error") return { outcome: "400", why: "`prefix_mismatch_behavior: \"error\"` rejects the request and names the first invalid block." };
  if (b === "drop_block") return { outcome: "dropped_not_billed", why: "`drop_block` drops the invalid blocks; you aren't billed for them, but dropping them can cost more." };
  if (r.settings.batch) return { outcome: "no_400", why: "A Message Batches item with the setting unset never gets the 400: the API drops the invalid blocks, or, on some models, can let them through." };
  if (m.unset_outcome === "400") return { outcome: "400", why: `${m.label} rejects B: The block is bound to a different conversation.` };
  let why = `${m.label} might return a 400, or let the blocks through: Claude reads them, you're billed for them, and it works from reasoning about content that has since changed.`;
  if (m.unset_note && !opts.oldAccount) why += ` ${m.unset_note}`;
  return { outcome: "possible_400", why };
}

function openaiVerdict(r, rules, id) {
  const m = modelInfo(id, rules);
  if (r.status === "no-thinking") return { outcome: "unknown", why: "B sends no reasoning items back, so nothing can be removed." };
  const reasons = [];
  let cacheMiss = false;
  if (r.paramChanges.length) {
    if (m.prefix_drop) reasons.push({ reason: "prefix_mismatch", why: `${r.paramChanges.map((c) => `\`${c.pathB}\``).join(", ")} changed: dropped (per OpenAI's keep-prefix-unchanged guide).` });
    else cacheMiss = true;
  }
  if (r.instructionsChanged && !m.instructions_after_input) cacheMiss = true;
  if (r.itemChange) {
    if (m.prefix_drop && r.blocks.some((b) => b.afterItemChange)) reasons.push({ reason: "prefix_mismatch", why: `${r.itemChange.detail}: reasoning items after it are removed.` });
    else if (!m.prefix_drop) cacheMiss = true;
  }
  if (r.safetyChanged && m.end_user_check) reasons.push({ reason: "end_user_mismatch", why: "`safety_identifier` differs between the requests (or is set on only one)." });
  if (reasons.length) return { outcome: "dropped", reasons: reasons.map((x) => x.reason), why: reasons.map((x) => x.why).join(" ") };
  if (cacheMiss) return { outcome: "none", info: "prefix-changed-cache-miss", why: "No reasoning removal for this reason before GPT-6.2 (prompt cache miss still likely)." };
  if (r.usesPrev) return { outcome: "unknown", why: "History is stored server-side and no setting changed, so there's nothing more we can check." };
  return { outcome: "none", why: "Nothing before the reasoning items changed." };
}

/** Model switch hand-off when A and B name different models. */
export function switchHandOff(result, rules) {
  const { a, b } = result.models || {};
  const undated = (id) => String(id).replace(/-\d{8}$/, "");
  if (!a || !b || undated(a) === undated(b)) return null;
  const s = switchCheck([a], b, {}, rules);
  return { from: a, to: b, result: s.rows[0].result, why: s.rows[0].why };
}

/** The fix for this result: by settings, then the first change's own fix, then its kind. */
export function chooseFix(result, rules) {
  const byId = (id) => rules.fixes.find((f) => f.id === id) || null;
  if (result.status === "settings-error") return byId("anthropic-remove-thinking-by-hand");
  const fc = result.firstChange;
  if (!fc) return null;
  if (fc.fix) return byId(fc.fix);
  const kind = rules.change_kinds.find((k) => k.id === fc.kind);
  return kind ? byId(kind.fix) : null;
}

/** Stopgap shown with every Anthropic fix: drop_block when thinking can be adaptive, else remove by hand. */
export function stopgap(result, rules) {
  if (result.api !== "anthropic") return null;
  const t = result.settings && result.settings.thinkingType;
  const id = t === "disabled" || t === "between_tools" ? "anthropic-remove-thinking-by-hand" : "anthropic-drop-block-stopgap";
  return rules.fixes.find((f) => f.id === id) || null;
}
