// OpenAI Responses: which reasoning items in request B would be removed,
// compared with an earlier request A. Rules: data/reasoning_rules.json
// (sources o-kp, o-rs, o-lm, o-ref). Pure.
import { canon } from "./canon.js";

const CAP = 2000;

function items(body) {
  const inp = body.input;
  if (typeof inp === "string") return [{ role: "user", content: inp }];
  return Array.isArray(inp) ? inp : [];
}

/** Alignment ops between two lists of canonical strings. */
function align(ca, cb) {
  const n = ca.length;
  const m = cb.length;
  const ops = [];
  if (n > CAP || m > CAP) {
    // Greedy forward match for very long logs.
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && ca[i] === cb[j]) { ops.push({ op: "eq", ia: i, ib: j }); i += 1; j += 1; continue; }
      const nextB = i < n ? cb.indexOf(ca[i], j) : -1;
      if (nextB >= 0 && nextB - j <= 50) { while (j < nextB) ops.push({ op: "ins", ib: j++ }); continue; }
      if (i < n) ops.push({ op: "del", ia: i++ });
      else ops.push({ op: "ins", ib: j++ });
    }
    return ops;
  }
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) for (let j = m - 1; j >= 0; j -= 1) dp[i][j] = ca[i] === cb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && ca[i] === cb[j]) { ops.push({ op: "eq", ia: i, ib: j }); i += 1; j += 1; }
    else if (i < n && (j === m || dp[i + 1][j] >= dp[i][j + 1])) ops.push({ op: "del", ia: i++ });
    else ops.push({ op: "ins", ib: j++ });
  }
  return ops;
}

const isUserMessage = (it) => it && (it.type === "message" || it.type === undefined) && it.role === "user";

/** Is `model` GPT-6.2 or later (reasoning removal + instructions after input)? */
export function familyOf(model, rules) {
  const known = rules && rules.openai.models.find((m) => m.id === model);
  if (known) return known.family;
  const re = new RegExp(rules ? rules.openai.family_regex : "^(gpt-\\d+(?:\\.\\d+)?)-");
  const m = re.exec(String(model || ""));
  return m ? m[1] : String(model || "");
}

export function modelInfo(model, rules) {
  const known = rules.openai.models.find((m) => m.id === model);
  if (known) return { ...known, known: true };
  const family = familyOf(model, rules);
  const v = /^gpt-(\d+)(?:\.(\d+))?$/.exec(family);
  // Compare major, then minor as an integer (gpt-5.12 is 5.12, not 6.2).
  const late = !!v && (Number(v[1]) > 6 || (Number(v[1]) === 6 && Number(v[2] || 0) >= 2));
  return { id: model, family, prefix_drop: late, end_user_check: late, instructions_after_input: late, known: false };
}

/**
 * Compare two Responses API requests.
 * @returns result object shared with the Anthropic comparison (see anthropic.js).
 */
export function compareOpenAI(A, B, opts = {}, rules) {
  const notes = [];
  const changes = [];
  const bModel = B.model || A.model || "";
  const bInfo = rules ? modelInfo(bModel, rules) : { instructions_after_input: false };
  const usesPrev = !!B.previous_response_id;

  const params = [
    { key: "tools", kind: "openai-tools-changed", get: (x) => x.tools ?? null, fix: "openai-additional-tools" },
    { key: "text.format", kind: "text-format-changed", get: (x) => (x.text && x.text.format) ?? null, fix: "openai-configuration-update-format" },
    { key: "reasoning.effort", kind: "effort-changed", get: (x) => (x.reasoning && x.reasoning.effort) ?? null, fix: "openai-configuration-update-effort" },
  ];
  const paramChanges = [];
  for (const p of params) {
    const a = p.get(A);
    const b = p.get(B);
    if (canon(a) !== canon(b)) paramChanges.push({ kind: p.kind, detail: `${p.key} changed`, pathA: p.key, pathB: p.key, a, b, fix: p.fix, confirmed: true, viaGuide: true });
  }
  const instructionsChanged = canon(A.instructions ?? null) !== canon(B.instructions ?? null);
  const instrChange = instructionsChanged ? { kind: "instructions-changed", detail: "instructions changed (a prefix change only before GPT-6.2)", pathA: "instructions", pathB: "instructions", a: A.instructions ?? null, b: B.instructions ?? null, fix: "openai-developer-message", confirmed: true } : null;
  const safetyChanged = (A.safety_identifier ?? null) !== (B.safety_identifier ?? null);
  const safetyChange = safetyChanged ? { kind: "safety-identifier-changed", detail: (A.safety_identifier == null || B.safety_identifier == null) ? "safety_identifier set on only one request" : "safety_identifier changed", pathA: "safety_identifier", pathB: "safety_identifier", a: A.safety_identifier ?? null, b: B.safety_identifier ?? null, fix: "openai-same-safety-identifier", confirmed: true } : null;

  changes.push(...paramChanges);
  if (instrChange && !bInfo.instructions_after_input) changes.push(instrChange);
  if (safetyChange) changes.push(safetyChange);

  // Items
  const ia = items(A);
  const ib = items(B);
  const blocks = [];
  let itemChange = null;
  const infos = [];
  if (!usesPrev) {
    const ca = ia.map((x) => canon(x));
    const cb = ib.map((x) => canon(x));
    const ops = align(ca, cb);
    // Pair dels and inses between two eq ops as edits.
    const edits = [];
    const inserts = [];
    const deletes = [];
    let runDel = [];
    let runIns = [];
    let lastEqB = -1;
    let lastAInvolvedB = -1;
    const flush = () => {
      const k = Math.min(runDel.length, runIns.length);
      for (let x = 0; x < k; x += 1) { edits.push({ ia: runDel[x], ib: runIns[x] }); lastAInvolvedB = Math.max(lastAInvolvedB, runIns[x]); }
      runDel.slice(k).forEach((d) => deletes.push(d));
      runIns.slice(k).forEach((s) => inserts.push({ ib: s, beforeEq: null }));
      runDel = [];
      runIns = [];
    };
    for (const o of ops) {
      if (o.op === "eq") { flush(); lastEqB = o.ib; lastAInvolvedB = Math.max(lastAInvolvedB, o.ib); }
      else if (o.op === "del") runDel.push(o.ia);
      else runIns.push(o.ib);
    }
    flush();
    // A-era: B items up to A's last item, then A's response (until the next user message).
    let aEraEnd = lastAInvolvedB;
    for (let k = lastAInvolvedB + 1; k < ib.length && !isUserMessage(ib[k]); k += 1) aEraEnd = k;
    const idsA = new Set(ia.filter((x) => x && x.type === "reasoning" && x.id).map((x) => x.id));
    // Insertions before A's last item change the prefix; later ones are appends.
    const prefixInserts = inserts.filter((s) => s.ib < lastAInvolvedB);
    const firstEdit = edits.length ? edits[0] : null;
    const firstIns = prefixInserts.length ? prefixInserts[0] : null;
    let at = null;
    if (firstEdit && (!firstIns || firstEdit.ib <= firstIns.ib)) {
      at = firstEdit.ib;
      itemChange = { kind: "item-edited", detail: `input.${firstEdit.ia} edited`, pathA: `input.${firstEdit.ia}`, pathB: `input.${firstEdit.ib}`, a: ia[firstEdit.ia], b: ib[firstEdit.ib], fix: fixForItem(ia[firstEdit.ia]), confirmed: true };
    } else if (firstIns) {
      at = firstIns.ib;
      itemChange = { kind: "item-inserted", detail: `item inserted at input.${firstIns.ib}`, pathA: null, pathB: `input.${firstIns.ib}`, a: null, b: ib[firstIns.ib], fix: "openai-append-at-end", confirmed: true };
    }
    if (deletes.length) infos.push({ id: "items-deleted", text: `${deletes.length} whole item(s) deleted from A (${deletes.slice(0, 5).map((d) => `input.${d}`).join(", ")}). Deleting whole items without editing the rest doesn't by itself trigger \`prefix_mismatch\`.`, ref: "o-rs" });
    if (itemChange) changes.push(itemChange);
    ib.forEach((it, k) => {
      if (!it || it.type !== "reasoning") return;
      const aEra = idsA.has(it.id) || (k <= aEraEnd);
      blocks.push({ path: `input.${k}`, id: it.id || null, type: "reasoning", aEra, afterItemChange: aEra && at !== null && k > at });
    });
  }

  const hasReasoning = usesPrev || blocks.length > 0;
  const status = !hasReasoning ? "no-thinking" : "ok";
  if (usesPrev) notes.push({ id: "previous-response-id", text: "History is stored on OpenAI's side, so we can't see earlier items. Only setting changes were checked.", ref: "o-kp" });
  const notCompared = [];
  for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
    if (["input", "tools", "text", "reasoning", "instructions", "safety_identifier"].includes(k)) continue;
    if (canon(A[k], { dropKeys: [] }) !== canon(B[k], { dropKeys: [] })) notCompared.push({ field: k, a: A[k], b: B[k] });
  }
  if ((A.reasoning || B.reasoning) && canon({ ...(A.reasoning || {}), effort: null }) !== canon({ ...(B.reasoning || {}), effort: null })) notCompared.push({ field: "reasoning (other than effort)", a: A.reasoning, b: B.reasoning });
  const order = (c) => (c.pathB && c.pathB.startsWith("input.") ? 1000 + Number(c.pathB.split(".")[1]) : 0);
  const sorted = changes.slice().sort((x, y) => order(x) - order(y));
  return {
    api: "openai", status, usesPrev,
    firstChange: sorted[0] || null,
    changes: sorted,
    paramChanges, instructionsChanged, instrChange, safetyChanged, itemChange,
    blocks,
    invalidPaths: blocks.filter((b) => b.afterItemChange || (b.aEra && (paramChanges.length || (instructionsChanged && !bInfo.instructions_after_input)))).map((b) => b.path),
    notCompared, notes: [...notes, ...infos],
    models: { a: A.model || null, b: B.model || null },
  };
}

function fixForItem(item) {
  if (item && (item.type === "function_call_output" || item.type === "custom_tool_call_output" || item.type === "input_image")) return "openai-shorten-before-first-send";
  if (item && item.role === "developer") return "openai-developer-message";
  return "openai-append-at-end";
}
