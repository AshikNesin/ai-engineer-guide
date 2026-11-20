// Anthropic Messages: which thinking blocks in request B fail the prefix
// check, compared with an earlier request A of the same conversation.
// Rules: data/reasoning_rules.json (sources a-pc, a-ct, a-fix). Pure.
import { canon, onlyCacheControlDiffers } from "./canon.js";

const THINKING = new Set(["thinking", "redacted_thinking"]);
const PLACEHOLDER_SIG = /^(|\.\.\.|…|sig|signature|<signature>|string)$/i;
const TOP_COMPARED = new Set(["system", "tools", "messages"]);
const LOOKAHEAD = 50;

const asBlocks = (content) => (typeof content === "string" ? [{ type: "text", text: content }] : Array.isArray(content) ? content : []);
const isThinking = (b) => b && typeof b === "object" && THINKING.has(b.type);

/** Message without its thinking blocks, as canonical JSON. */
function rep(msg, normalize) {
  if (!msg || typeof msg !== "object") return canon(msg);
  const { content, ...rest } = msg;
  let c = content;
  if (Array.isArray(content)) c = content.filter((b) => !isThinking(b));
  if (normalize) c = asBlocks(c).filter((b) => !isThinking(b));
  return canon({ ...rest, content: c });
}

/** Names that something in the messages refers to (deferred tools only count once referred to). */
function referencedToolNames(messages) {
  const names = new Set();
  const visit = (v) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    if ((v.type === "tool_reference" || v.type === "tool_use" || v.type === "server_tool_use") && typeof v.name === "string") names.add(v.name);
    if (v.type === "tool_reference" && typeof v.tool_name === "string") names.add(v.tool_name);
    Object.values(v).forEach(visit);
  };
  visit(messages);
  return names;
}

function toolKey(t, i) { return (t && (t.name || (t.type === "mcp_toolset" && `mcp_toolset:${t.mcp_server_name}`))) || `#${i}`; }

/** Diff `tools` by name. Returns null when equal for the prefix check. */
function diffTools(ta, tb, referenced) {
  const counts = (t) => !(t && t.defer_loading === true && !referenced.has(t.name));
  const listA = (Array.isArray(ta) ? ta : []).map((t, i) => ({ key: toolKey(t, i), t, i }));
  const listB = (Array.isArray(tb) ? tb : []).map((t, i) => ({ key: toolKey(t, i), t, i }));
  const mapA = new Map(listA.map((x) => [x.key, x]));
  const mapB = new Map(listB.map((x) => [x.key, x]));
  const changes = [];
  const ignored = [];
  for (const b of listB) {
    const a = mapA.get(b.key);
    if (!a) {
      if (counts(b.t)) changes.push({ detail: `tool added: ${b.key}`, sub: "tool-added", pathB: `tools.${b.i}`, b: b.t });
      else ignored.push(`deferred tool added and not referred to: ${b.key}`);
      continue;
    }
    if (canon(a.t) === canon(b.t)) continue;
    const da = a.t && a.t.defer_loading === true;
    const db = b.t && b.t.defer_loading === true;
    if (da !== db) {
      changes.push({ detail: `defer_loading toggled: ${b.key}`, sub: "defer-loading-toggled", pathA: `tools.${a.i}`, pathB: `tools.${b.i}`, a: a.t, b: b.t });
      continue;
    }
    if (!counts(a.t) && !counts(b.t)) { ignored.push(`deferred tool changed and not referred to: ${b.key}`); continue; }
    const descOnly = canon({ ...a.t, description: null }) === canon({ ...b.t, description: null });
    changes.push({
      detail: descOnly ? `tool description reworded: ${b.key}` : `tool changed: ${b.key}`,
      sub: descOnly ? "tool-description-reworded" : "tool-changed",
      pathA: `tools.${a.i}${descOnly ? ".description" : ""}`, pathB: `tools.${b.i}${descOnly ? ".description" : ""}`,
      a: descOnly ? a.t.description : a.t, b: descOnly ? b.t.description : b.t,
    });
  }
  for (const a of listA) {
    if (mapB.has(a.key)) continue;
    if (counts(a.t)) changes.push({ detail: `tool removed: ${a.key}`, sub: "tool-removed", pathA: `tools.${a.i}`, a: a.t });
    else ignored.push(`deferred tool removed and not referred to: ${a.key}`);
  }
  if (!changes.length) {
    // Same tools in a different order is still a change to `tools`.
    const orderA = listA.filter((x) => counts(x.t)).map((x) => x.key).join("\n");
    const orderB = listB.filter((x) => counts(x.t)).map((x) => x.key).join("\n");
    if (orderA !== orderB) changes.push({ detail: "tools reordered", sub: "tools-reordered", pathA: "tools", pathB: "tools", a: listA.map((x) => x.key), b: listB.map((x) => x.key) });
  }
  return { changes, ignored };
}

function firstBlockDiff(ma, mb) {
  const nonThinking = (m) => {
    if (typeof m.content === "string") return [{ idx: null, b: m.content }];
    return asBlocks(m.content).map((b, idx) => ({ idx, b })).filter((x) => !isThinking(x.b));
  };
  const la = nonThinking(ma);
  const lb = nonThinking(mb);
  for (let k = 0; k < Math.max(la.length, lb.length); k += 1) {
    const a = la[k];
    const b = lb[k];
    if (a && b && canon(a.b) === canon(b.b)) continue;
    return { a, b };
  }
  return { a: null, b: null };
}

function fileUrl(block) {
  const s = block && typeof block === "object" && block.source;
  return s && s.type === "url" ? s.url : null;
}

/**
 * Compare two Anthropic Messages requests.
 * @param {object} A earlier request (or the one that worked)
 * @param {object} B next request (or the one that failed)
 * @param {object} opts { behavior?: null|"error"|"drop_block" (default: read from B), batch?: boolean }
 */
export function compareAnthropic(A, B, opts = {}) {
  const notes = [];
  const changes = [];
  const thinking = B.thinking && typeof B.thinking === "object" ? B.thinking : null;
  const bindingSent = !!(thinking && thinking.block_binding);
  const behavior = opts.behavior !== undefined ? opts.behavior : (thinking && thinking.block_binding && thinking.block_binding.prefix_mismatch_behavior) || null;
  const thinkingType = thinking ? thinking.type || null : null;
  const settings = {
    behavior, thinkingType, batch: !!opts.batch,
    error: bindingSent && (thinkingType === "disabled" || thinkingType === "between_tools"),
    betas: Array.isArray(B.betas) ? B.betas : null,
  };

  const msgsA = Array.isArray(A.messages) ? A.messages : [];
  const msgsB = Array.isArray(B.messages) ? B.messages : [];

  // Compaction: compare from the last compaction block on, in both requests.
  const lastCompaction = (msgs) => {
    for (let i = msgs.length - 1; i >= 0; i -= 1) if (asBlocks(msgs[i] && msgs[i].content).some((b) => b && b.type === "compaction")) return i;
    return -1;
  };
  const ca = lastCompaction(msgsA);
  const cb = lastCompaction(msgsB);
  let compactionUnknown = false;
  if (cb >= 0 && ca < 0) {
    compactionUnknown = true;
    notes.push({ id: "compaction-new", text: "B starts from a compaction block that A doesn't have, so its kept thinking follows the compaction rules, which this pair can't show. Compare B with the request after it instead.", ref: "a-pc" });
  } else if (cb >= 0) {
    notes.push({ id: "compaction", text: "Compaction block found: only the messages from it on are compared, plus `system` and `tools`.", ref: "a-pc" });
  }
  const startA = ca >= 0 && cb >= 0 ? ca : 0;
  const startB = ca >= 0 && cb >= 0 ? cb : 0;

  // 1. system
  if (canon(A.system ?? null) !== canon(B.system ?? null)) {
    const sameText = canon(asBlocks(A.system ?? "")) === canon(asBlocks(B.system ?? ""));
    changes.push(sameText
      ? { kind: "content-format-changed", detail: "system: string vs text-block array", pathA: "system", pathB: "system", a: A.system, b: B.system, confirmed: false, loc: { msg: -1 } }
      : { kind: "system-changed", detail: "system prompt changed", pathA: "system", pathB: "system", a: A.system ?? null, b: B.system ?? null, confirmed: true, loc: { msg: -1 } });
  }

  // 2. tools
  const referenced = referencedToolNames(msgsA);
  const td = diffTools(A.tools, B.tools, referenced);
  if (td.changes.length) {
    const t = td.changes[0];
    changes.push({ kind: "tools-changed", detail: t.detail, sub: t.sub, pathA: t.pathA || "tools", pathB: t.pathB || "tools", a: t.a, b: t.b, confirmed: true, loc: { msg: -1 }, all: td.changes.map((c) => c.detail) });
  }
  const ignoredTools = td.ignored;

  // 3. messages
  const ra = msgsA.slice(startA).map((m) => rep(m));
  const rb = msgsB.slice(startB).map((m) => rep(m));
  let i = 0;
  while (i < ra.length && i < rb.length && ra[i] === rb[i]) i += 1;
  let shift = 0; // B index = A index - startA + startB + shift, after the change
  let msgChange = null;
  if (i < ra.length) {
    const ia = startA + i;
    const ib = startB + i;
    let del = -1;
    let ins = -1;
    for (let d = 1; d <= LOOKAHEAD && i + d < ra.length; d += 1) if (i < rb.length && ra[i + d] === rb[i]) { del = d; break; }
    for (let e = 1; e <= LOOKAHEAD && i + e < rb.length; e += 1) if (rb[i + e] === ra[i]) { ins = e; break; }
    if (i >= rb.length) {
      msgChange = { kind: "message-deleted", detail: `B ends before A: ${ra.length - i} message(s) missing`, pathA: `messages.${ia}`, pathB: `messages.${ib}`, a: msgsA[ia], b: null, confirmed: true, loc: { msg: ib, block: -1 } };
    } else if (del > 0 && (ins < 0 || del <= ins)) {
      const trimmed = i === 0;
      msgChange = {
        kind: trimmed ? "messages-trimmed" : "message-deleted",
        detail: trimmed ? `first ${del} message(s) removed (trimmed or summarized)` : `${del} message(s) deleted at messages.${ia}`,
        pathA: `messages.${ia}`, pathB: `messages.${ib}`, a: msgsA[ia], b: msgsB[ib], confirmed: true, loc: { msg: ib, block: -1 },
      };
      shift = -del;
    } else if (ins > 0) {
      msgChange = { kind: "message-inserted", detail: `${ins} message(s) inserted at messages.${ib}`, pathA: `messages.${ia}`, pathB: `messages.${ib}`, a: msgsA[ia], b: msgsB[ib], confirmed: true, loc: { msg: ib, block: -1 } };
      shift = ins;
    } else if (rep(msgsA[ia], true) === rep(msgsB[ib], true)) {
      msgChange = { kind: "content-format-changed", detail: `messages.${ib}: string content vs text-block array`, pathA: `messages.${ia}.content`, pathB: `messages.${ib}.content`, a: msgsA[ia].content, b: msgsB[ib].content, confirmed: false, loc: { msg: ib, block: -1 } };
    } else {
      const ma = msgsA[ia] || {};
      const mb = msgsB[ib] || {};
      if (ma.role !== mb.role || canon({ ...ma, content: null }) !== canon({ ...mb, content: null })) {
        msgChange = { kind: "message-edited", detail: `messages.${ib} changed (role or fields)`, pathA: `messages.${ia}`, pathB: `messages.${ib}`, a: ma, b: mb, confirmed: true, loc: { msg: ib, block: -1 } };
      } else {
        const { a, b } = firstBlockDiff(ma, mb);
        const pa = a ? (a.idx === null ? `messages.${ia}.content` : `messages.${ia}.content.${a.idx}`) : `messages.${ia}.content`;
        const pb = b ? (b.idx === null ? `messages.${ib}.content` : `messages.${ib}.content.${b.idx}`) : `messages.${ib}.content`;
        const blockA = a && a.b;
        const blockB = b && b.b;
        let detail = `${pb} edited`;
        let fix;
        let confirmed = true;
        if (blockA && blockB && typeof blockA === "object" && blockA.type === "tool_result" && blockB.type === "tool_result") {
          detail = `tool result changed at ${pb}`;
          fix = "anthropic-context-editing";
        } else if (fileUrl(blockA) && fileUrl(blockB) && fileUrl(blockA) !== fileUrl(blockB) && canon({ ...blockA, source: null }) === canon({ ...blockB, source: null })) {
          detail = "file URL changed: counts only if the bytes differ";
          confirmed = false;
        } else if (!blockB) detail = `block removed from messages.${ib}`;
        else if (!blockA) detail = `block added to messages.${ib} before later content`;
        msgChange = { kind: "message-edited", detail, fix, pathA: pa, pathB: pb, a: blockA ?? null, b: blockB ?? null, confirmed, loc: { msg: ib, block: b && b.idx !== null ? b.idx : -1 } };
      }
    }
    changes.push(msgChange);
  }

  // Where A's last message sits in B, so we know which thinking was produced before B.
  let lastAinB = startB + ra.length - 1 + shift;
  if (msgChange && ra.length) {
    const target = ra[ra.length - 1];
    for (let k = rb.length - 1; k >= 0; k -= 1) if (rb[k] === target) { lastAinB = startB + k; break; }
  }
  const responseIdx = msgsB[lastAinB + 1] && msgsB[lastAinB + 1].role === "assistant" ? lastAinB + 1 : -1;
  const aEraEnd = responseIdx >= 0 ? responseIdx : lastAinB;
  const mapA2B = (ia) => {
    const rel = ia - startA;
    if (!msgChange || rel < i) return startB + rel;
    return startB + rel + shift;
  };

  // 4. Thinking blocks.
  const collect = (msgs, start) => {
    const out = [];
    msgs.forEach((m, mi) => {
      if (mi < start || !m || !Array.isArray(m.content)) return;
      let nt = 0;
      let run = 0;
      let group = null;
      m.content.forEach((b, bj) => {
        if (isThinking(b)) {
          if (group === null) group = `${mi}:${bj}`;
          out.push({ m: mi, j: bj, path: `messages.${mi}.content.${bj}`, type: b.type, sig: b.type === "redacted_thinking" ? b.data : b.signature, empty: b.type === "thinking" && b.thinking === "", nt, ord: run, group });
          run += 1;
        } else { nt += 1; run = 0; group = null; }
      });
    });
    return out;
  };
  const thA = collect(msgsA, startA);
  const thB = collect(msgsB, startB);
  const sigsA = thA.map((t) => t.sig);
  const useSigs = thA.length > 0 && sigsA.every((s) => typeof s === "string" && !PLACEHOLDER_SIG.test(s.trim())) && new Set(sigsA).size === sigsA.length;
  if (thA.length && !useSigs) notes.push({ id: "placeholder-signatures", text: "Signatures look like placeholders (empty, \"...\" or repeated), so thinking blocks were matched by position instead." });

  const keyA = (t) => `${mapA2B(t.m)}:${t.nt}:${t.ord}`;
  const keyB = (t) => `${t.m}:${t.nt}:${t.ord}`;
  const bKeys = new Map(thB.map((t) => [useSigs ? t.sig : keyB(t), t]));
  const seq = thA.map((t) => ({ ...t, inB: bKeys.get(useSigs ? t.sig : keyA(t)) || null }));
  const aEraB = new Set(seq.filter((s) => s.inB).map((s) => s.inB.path));
  const response = thB.filter((t) => t.m === responseIdx);
  response.forEach((t) => aEraB.add(t.path));
  // Full original order: A's thinking, then A's response.
  const full = [...seq.map((s) => ({ present: !!s.inB, a: s, b: s.inB, group: `A${s.group}` })), ...response.map((t) => ({ present: true, a: null, b: t, group: `R${t.group}` }))];

  let gap = null;
  const firstPresent = full.findIndex((x) => x.present);
  if (firstPresent >= 0) {
    for (let k = firstPresent + 1; k < full.length && !gap; k += 1) {
      if (!full[k].present && full.slice(k + 1).some((x) => x.present)) gap = k;
    }
    // Blocks with no other block between them in a turn: all or none.
    const groups = new Map();
    full.forEach((x, k) => { if (!groups.has(x.group)) groups.set(x.group, []); groups.get(x.group).push(k); });
    for (const ks of groups.values()) {
      const pres = ks.filter((k) => full[k].present);
      if (pres.length && pres.length < ks.length) {
        const miss = ks.find((k) => !full[k].present);
        const after = full.slice(miss + 1).some((x) => x.present);
        if (after && (gap === null || miss < gap)) gap = miss;
      }
    }
    // Moved blocks: B must keep A's order.
    if (useSigs) {
      const order = seq.filter((s) => s.inB).map((s) => thB.indexOf(s.inB));
      for (let k = 1; k < order.length && gap === null; k += 1) {
        if (order[k] < order[k - 1]) gap = full.indexOf(full.find((x) => x.a === seq.filter((s) => s.inB)[k]));
      }
    }
  }
  const afterGap = new Set();
  let gapChange = null;
  if (gap !== null) {
    const missing = full[gap];
    full.slice(gap + 1).forEach((x) => { if (x.present && x.b) afterGap.add(x.b.path); });
    const firstInvalid = full.slice(gap + 1).find((x) => x.present && x.b);
    const empty = missing.a && missing.a.empty && !missing.present;
    gapChange = {
      kind: "thinking-gap",
      detail: missing.present ? "thinking block moved" : empty ? "empty thinking block dropped" : "a thinking block between others was left out",
      pathA: missing.a ? missing.a.path : null, pathB: firstInvalid ? firstInvalid.b.path : null,
      a: missing.a ? { type: missing.a.type, empty: missing.a.empty } : null, b: null, confirmed: true,
      loc: firstInvalid ? { msg: firstInvalid.b.m, block: firstInvalid.b.j - 1 } : { msg: Infinity, block: 0 },
    };
    changes.push(gapChange);
  }

  // 5. Which thinking blocks in B sit after the first change.
  const after = (t, loc) => loc.msg < 0 || t.m > loc.msg || (t.m === loc.msg && t.j > loc.block);
  const ordered = changes.slice().sort((x, y) => (x.loc.msg - y.loc.msg) || ((x.loc.block ?? -1) - (y.loc.block ?? -1)));
  const firstConfirmed = ordered.find((c) => c.confirmed && c.kind !== "thinking-gap");
  const firstUnconfirmed = ordered.find((c) => !c.confirmed);
  const blocks = thB.map((t) => {
    const aEra = aEraB.has(t.path) || (t.m <= aEraEnd && t.m >= startB);
    const inv = aEra && ((firstConfirmed && after(t, firstConfirmed.loc)) || afterGap.has(t.path));
    const maybe = aEra && !inv && firstUnconfirmed && after(t, firstUnconfirmed.loc);
    return { path: t.path, type: t.type, empty: t.empty, aEra, invalid: !!inv, unconfirmed: !!maybe };
  });

  // 6. Not compared: top-level fields that differ but don't count.
  const notCompared = [];
  const keys = new Set([...Object.keys(A), ...Object.keys(B)]);
  for (const k of keys) {
    if (TOP_COMPARED.has(k)) continue;
    if (canon(A[k], { dropKeys: [] }) !== canon(B[k], { dropKeys: [] })) notCompared.push({ field: k, a: A[k], b: B[k] });
  }
  if (["system", "tools", "messages"].some((k) => onlyCacheControlDiffers(A[k], B[k])) ||
      (msgsA.length && msgsA.some((m, k) => msgsB[k] && onlyCacheControlDiffers(m, msgsB[k])))) {
    notCompared.push({ field: "cache_control" });
  }
  ignoredTools.forEach((t) => notCompared.push({ field: "deferred_unreferenced_tool", detail: t }));

  // 7. Notes for things we can't see.
  const all = JSON.stringify([B.tools, B.messages, B.mcp_servers]);
  if (B.mcp_servers || /"mcp_toolset"/.test(all)) notes.push({ id: "mcp", text: "MCP connector found: the API compares the tool list it fetched, which this page can't see. Pin the server's tool list if it can change.", ref: "a-pc" });
  if (/"type":"fallback"/.test(JSON.stringify(B.messages || []))) notes.push({ id: "fallback", text: "A turn with a `fallback` block has its own rule, which this checker doesn't evaluate.", url: "https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback#continuing-the-conversation" });
  if (B.context_management) notes.push({ id: "context-editing", text: "`context_management` (context editing) changes only what Claude reads, so it never counts as a change.", ref: "a-pc" });
  if (bindingSent && settings.betas && !settings.betas.includes("thinking-binding-controls-2026-08-01")) notes.push({ id: "beta-header", text: "`block_binding` is set but `betas` doesn't list `thinking-binding-controls-2026-08-01`. Without that header the request gets a 400.", ref: "a-fix" });

  const hasThinking = thB.length > 0;
  const status = settings.error ? "settings-error" : compactionUnknown ? "compaction-unknown" : !hasThinking ? "no-thinking" : "ok";
  const first = ordered[0] || null;
  return {
    api: "anthropic", status, settings,
    firstChange: first ? strip(first) : null,
    changes: ordered.map(strip),
    blocks,
    invalidPaths: blocks.filter((b) => b.invalid).map((b) => b.path),
    unconfirmedPaths: blocks.filter((b) => b.unconfirmed).map((b) => b.path),
    notCompared, notes,
    models: { a: A.model || null, b: B.model || null },
  };
}

function strip(c) {
  const { loc, ...rest } = c;
  return rest;
}

/** Map an error's `messages.N.content.M` to the index in the array you sent.
 *  The error counts a `role: "system"` message, or one with the same role as
 *  the message before, as part of that earlier message (a-fix). Best guess. */
export function errorPathToSentIndex(messages, errorPath) {
  const m = /^messages\.(\d+)\.content\.(\d+)/.exec(String(errorPath || ""));
  if (!m || !Array.isArray(messages)) return null;
  const L = Number(m[1]);
  const M = Number(m[2]);
  const logical = [];
  messages.forEach((msg, i) => {
    const blocks = asBlocks(msg && msg.content).map((_, j) => [i, j]);
    const prev = logical[logical.length - 1];
    if (prev && i > 0 && (msg.role === "system" || msg.role === messages[i - 1].role)) prev.push(...blocks);
    else logical.push(blocks);
  });
  const hit = logical[L] && logical[L][M];
  if (!hit) return null;
  return { msg: hit[0], block: hit[1], path: `messages.${hit[0]}.content.${hit[1]}`, same: hit[0] === L && hit[1] === M };
}
