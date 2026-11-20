// input_transformations decoder and error-string recognizer. Pure.
import { jsonErrorPosition, getPath, preview } from "./canon.js";
import { errorPathToSentIndex } from "./anthropic.js";

/** Parse an SSE stream; returns the list of event payloads (parsed JSON). */
export function parseSSE(text) {
  const events = [];
  let name = null;
  for (const line of String(text).split(/\r?\n/)) {
    if (line.startsWith("event:")) name = line.slice(6).trim();
    else if (line.startsWith("data:")) {
      const d = line.slice(5).trim();
      if (!d || d === "[DONE]") continue;
      try { const obj = JSON.parse(d); events.push({ event: name || obj.type, data: obj }); } catch (_) { /* skip partial lines */ }
    }
  }
  return events;
}

/**
 * Read what was pasted into the decoder.
 * @returns {{ kind, provider, entries?, error?, source?, note? }}
 */
export function readPaste(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Paste a response, an error body, or an input_transformations array.");
  if (/^(event|data):/m.test(raw) && !raw.startsWith("{") && !raw.startsWith("[")) {
    const events = parseSSE(raw);
    if (!events.length) throw new Error("Couldn't read any `data:` lines from that stream.");
    let entries = null;
    let source = null;
    for (const e of events) {
      const d = e.data;
      if (d.type === "message_start" && d.message && Array.isArray(d.message.input_transformations)) { entries = d.message.input_transformations; source = "message_start"; }
      const fromDelta = d.type === "message_delta" && (d.input_transformations || (d.delta && d.delta.input_transformations) || (d.message && d.message.input_transformations));
      if (Array.isArray(fromDelta)) { entries = fromDelta; source = "message_delta"; }
      if (d.type === "error" && d.error) return { kind: "error", provider: "anthropic", error: d.error };
    }
    return { kind: "sse", provider: "anthropic", entries: entries || [], source };
  }
  let obj;
  try { obj = JSON.parse(raw); } catch (err) { throw new Error(jsonErrorPosition(raw, err).message); }
  if (Array.isArray(obj)) return { kind: "array", provider: inferProvider(obj), entries: obj };
  if (obj && obj.type === "error" && obj.error) return { kind: "error", provider: "anthropic", error: obj.error };
  if (obj && obj.error && typeof obj.error === "object" && !obj.object) return { kind: "error", provider: obj.error.type === "invalid_request_error" && !("code" in obj.error) ? "anthropic" : "unknown", error: obj.error };
  if (obj && (obj.object === "response" || Array.isArray(obj.output))) return { kind: "response", provider: "openai", entries: obj.input_transformations || [] };
  if (obj && (obj.type === "message" || (obj.content && obj.usage))) return { kind: "response", provider: "anthropic", entries: obj.input_transformations || [] };
  if (obj && Array.isArray(obj.input_transformations)) return { kind: "response", provider: inferProvider(obj.input_transformations), entries: obj.input_transformations };
  throw new Error("Couldn't find `input_transformations` or an error in that. Paste the whole response or error body.");
}

function inferProvider(arr) {
  const e = arr.find((x) => x && typeof x === "object");
  if (!e) return "unknown";
  if ("path" in e || /^thinking_/.test(String(e.type))) return "anthropic";
  if ("id" in e || "action" in e || e.type === "reasoning") return "openai";
  return "unknown";
}

/** Decode entries against the reasons in the rules data. `request` is optional. */
export function decodeEntries(paste, rules, request) {
  const rows = (paste.entries || []).map((e) => {
    const provider = paste.provider !== "unknown" ? paste.provider : inferProvider([e]);
    const reason = rules.reasons.find((r) => r.provider === provider && r.reason === e.reason && (provider === "openai" || r.type === e.type));
    const row = { entry: e, provider, reason: reason || null, known: !!reason, yours: reason ? reason.yours : "unknown" };
    if (request) row.resolved = resolve(provider, e, request);
    return row;
  });
  const yours = rows.filter((r) => r.yours === "yes").length;
  const expected = rows.filter((r) => r.yours === "no").length;
  const maybe = rows.filter((r) => r.yours === "maybe" || r.yours === "usually-no").length;
  const unknown = rows.filter((r) => !r.known).length;
  return { rows, counts: { total: rows.length, yours, expected, maybe, unknown }, source: paste.source || null };
}

export function summaryLine(counts) {
  if (!counts.total) return "No entries: nothing was dropped or let through.";
  const parts = [];
  if (counts.yours) parts.push(`${counts.yours} yours to fix`);
  if (counts.expected) parts.push(`${counts.expected} expected (not yours to fix)`);
  if (counts.maybe) parts.push(`${counts.maybe} maybe yours`);
  if (counts.unknown) parts.push(`${counts.unknown} unknown`);
  return `${counts.total} ${counts.total === 1 ? "entry" : "entries"}: ${parts.join(", ")}.`;
}

function resolve(provider, e, request) {
  if (provider === "anthropic" && e.path) {
    const block = getPath(request, e.path);
    const mi = Number((/^messages\.(\d+)/.exec(e.path) || [])[1]);
    const msg = request.messages && request.messages[mi];
    if (block === undefined) return { found: false };
    const before = mi > 0 ? request.messages[mi - 1] : null;
    return { found: true, path: e.path, role: msg && msg.role, type: block && block.type, preview: preview(block), before: before ? `${before.role}: ${preview(typeof before.content === "string" ? before.content : (before.content || []).find((b) => b.type !== "thinking" && b.type !== "redacted_thinking") || "")}` : null };
  }
  if (provider === "openai" && e.id && Array.isArray(request.input)) {
    const idx = request.input.findIndex((it) => it && it.id === e.id);
    if (idx < 0) return { found: false };
    return { found: true, path: `input.${idx}`, type: request.input[idx].type };
  }
  return { found: false };
}

/** Match an error body against errors[] in order. */
export function recognizeError(error, rules, request) {
  const msg = String((error && error.message) || error || "");
  const all = matchErrors(msg, rules);
  const hit = all[0] || null;
  const pathMatch = /^(messages\.\d+\.content\.\d+)/.exec(msg.trim());
  const res = { message: msg, match: hit, also: all.slice(1), path: pathMatch ? pathMatch[1] : null, mapped: null };
  if (res.path && request && Array.isArray(request.messages)) res.mapped = errorPathToSentIndex(request.messages, res.path);
  return res;
}

/** Every errors[] entry the message matches, in data order. */
export function matchErrors(msg, rules) {
  const out = [];
  for (const e of rules.errors) {
    if (e.match_any && e.match_any.some((s) => msg.includes(s)) && !(e.unless && msg.includes(e.unless))) out.push(e);
    else if (e.match && msg.includes(e.match)) out.push(e);
  }
  if (!out.length && /temperature|prefill/i.test(msg)) out.push(...rules.error_lookalikes.filter((x) => x.id === "temperature-or-prefill"));
  return out;
}

export const matchError = (msg, rules) => matchErrors(msg, rules)[0] || null;
