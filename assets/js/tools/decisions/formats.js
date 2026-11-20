// Parse and emit decision requests: OpenAI Decisions, Gemini Decisions and
// System One (TypeSafe Jev, Cloudflare Clef). Everything goes through an IR:
//   { input: {kind: "text"|"json"|"messages"|"media", value},
//     questions: [{ key, unnamed?, kind: "yesno"|"choice"|"score"|"box",
//       instructions, instructionParts?, yes, no, options: [{value, description}],
//       levels: [{label, description, text?}], raw? }] }
// Pure; tested in tests/decisions.test.mjs.

/** "openai" | "gemini" | "jev" | "clef" | null */
export function detectFormat(body) {
  if (!body || typeof body !== "object") return null;
  if (Array.isArray(body.questions)) return "openai";
  if (body.questions && typeof body.questions === "object") {
    if ("state" in body) return /^clef/.test(String(body.model || "")) ? "clef" : "jev";
    if ("input" in body) return "gemini";
  }
  return null;
}

const textOfParts = (parts) => parts.filter((p) => p && (p.type === "input_text" || p.type === "text" || typeof p.text === "string")).map((p) => p.text).join("\n");

// Assign as an own property, so a key like "__proto__" isn't lost.
const put = (obj, k, v) => Object.defineProperty(obj, k, { value: v, enumerable: true, writable: true, configurable: true });

// Text and input_json parts as text (JSON kept as a JSON string), for history serialization.
const partsToText = (parts) => parts.map((p) => (p && p.type === "input_json" ? JSON.stringify(p.data) : p && typeof p.text === "string" ? p.text : null)).filter((x) => x !== null).join("\n");

// ---------------------------------------------------------------- parse
export function parse(body, format, warn) {
  if (format === "openai") return parseOpenAI(body, warn);
  if (format === "gemini") return parseGemini(body, warn);
  return parseSystemOne(body, format, warn);
}

function parseOpenAI(body, warn) {
  let input;
  const inp = body.input;
  if (typeof inp === "string") input = { kind: "text", value: inp };
  else if (Array.isArray(inp)) {
    const only = inp.length === 1 && inp[0] && Array.isArray(inp[0].content) && inp[0].content.length === 1 && inp[0].content[0].type === "input_json";
    const media = JSON.stringify(inp).match(/"type":"input_(image|audio|file)"/);
    if (only) input = { kind: "json", value: inp[0].content[0].data };
    else if (media) input = { kind: "media", value: inp };
    else input = { kind: "messages", value: inp };
  } else input = { kind: "text", value: "" };
  const questions = (body.questions || []).map((q, i) => {
    const key = q.name || `q${i + 1}`;
    const base = { key, unnamed: !q.name, ...instr(q.instructions) };
    if (q.type === "predicate") return { ...base, kind: "yesno", yes: null, no: null };
    if (q.type === "choice") return { ...base, kind: "choice", options: (q.choices || []).map((c) => ({ value: c.value, description: c.description ?? null })) };
    if (q.type === "score") return { ...base, kind: "score", levels: (q.levels || []).map((l) => ({ label: l.label ?? null, description: l.description ?? null })) };
    warn("unknown-type", key, `Unknown question type "${q.type}", left out.`);
    return null;
  }).filter(Boolean);
  return { input, questions };
}

function instr(v) {
  if (Array.isArray(v)) {
    const media = v.some((p) => p && p.type && p.type !== "input_text");
    return { instructions: textOfParts(v), instructionParts: media ? v : null };
  }
  return { instructions: v == null ? "" : typeof v === "string" ? v : JSON.stringify(v), instructionParts: null };
}

function parseGemini(body, warn) {
  let input;
  const inp = body.input;
  if (typeof inp === "string") input = { kind: "text", value: inp };
  else {
    const contents = Array.isArray(inp) ? inp : inp ? [inp] : [];
    const parts = contents.flatMap((c) => (c && Array.isArray(c.parts) ? c.parts : [c]));
    const nonText = parts.some((p) => p && typeof p === "object" && !("text" in p));
    input = nonText ? { kind: "media", value: inp } : { kind: "text", value: parts.map((p) => (typeof p === "string" ? p : p.text)).join("\n") };
  }
  const questions = Object.entries(body.questions || {}).map(([key, q]) => {
    const base = { key, instructions: q.instructions ?? "", instructionParts: null };
    const c = q.criteria;
    if (q.type === "noul") return { ...base, kind: "yesno", yes: (c && c.true_description) || null, no: (c && c.false_description) || null };
    if (q.type === "choice") return { ...base, kind: "choice", options: Object.entries(c || {}).map(([value, d]) => ({ value, description: d === "" || d == null ? null : d })) };
    if (q.type === "score") return { ...base, kind: "score", levels: (c || []).map((t) => ({ label: null, description: null, text: String(t) })) };
    warn("unknown-type", key, `Unknown question type "${q.type}", left out.`);
    return null;
  }).filter(Boolean);
  return { input, questions };
}

function parseSystemOne(body, format, warn) {
  let input;
  const st = body.state;
  if (typeof st === "string") input = { kind: "text", value: st };
  else input = { kind: "json", value: st ?? null };
  if (body.assets || body.images) warn("media-manual", null, format === "clef" ? "Clef `images` aren't converted; move them by hand." : "Jev `assets` aren't converted; move them by hand.");
  const questions = Object.entries(body.questions || {}).map(([key, q]) => {
    const base = { key, ...instr(q.instructions) };
    const c = q.criteria;
    if (q.type === "noul") return { ...base, kind: "yesno", yes: (c && c.true) ?? null, no: (c && c.false) ?? null };
    if (q.type === "choice") return { ...base, kind: "choice", options: Object.entries(c || {}).map(([value, d]) => ({ value, description: d ?? null })) };
    if (q.type === "score") return { ...base, kind: "score", levels: (c || []).map((t) => (typeof t === "string" ? { label: null, description: null, text: t } : { label: t.label ?? null, description: t.description ?? null })) };
    if (q.type === "box") return { ...base, kind: "box", raw: q };
    warn("unknown-type", key, `Unknown question type "${q.type}", left out.`);
    return null;
  }).filter(Boolean);
  return { input, questions };
}

// ---------------------------------------------------------------- emit
const levelText = (l) => (l.text != null ? l.text : l.label && l.description ? `${l.label}: ${l.description}` : (l.label || l.description || ""));

export function splitLevel(s) {
  const i = s.indexOf(": ");
  if (i > 0 && i <= 60) return { label: s.slice(0, i), description: s.slice(i + 2), how: "split" };
  return { label: s.length > 60 ? s.slice(0, 59) + "…" : s, description: s, how: "whole" };
}

export function emitOpenAI(ir, fmt, warn) {
  let input;
  if (ir.input.kind === "text") input = ir.input.value;
  else if (ir.input.kind === "json") input = [{ role: "user", content: [{ type: "input_json", data: ir.input.value }] }];
  else { input = ir.input.value; if (ir.input.kind === "media") warn("media-manual", null); }
  const questions = [];
  for (const q of ir.questions) {
    if (q.kind === "box") { warn("box-unsupported", q.key); continue; }
    const out = { type: fmt.types[q.kind], name: q.key };
    let instructions = q.instructionParts || q.instructions;
    if (q.kind === "yesno" && (q.yes || q.no)) {
      instructions = `${q.instructions}${q.instructions ? " " : ""}${q.yes ? `Yes means: ${q.yes}` : ""}${q.yes && q.no ? " " : ""}${q.no ? `No means: ${q.no}` : ""}`;
      warn("criteria-folded", q.key);
      if (q.instructionParts) warn("instructions-parts", q.key);
    }
    out.instructions = instructions;
    if (q.kind === "choice") {
      out.choices = q.options.map((o) => (o.description == null ? { value: o.value } : { value: o.value, description: o.description }));
      count(warn, fmt, "choices", q.key, out.choices.length);
    }
    if (q.kind === "score") {
      const split = [];
      out.levels = q.levels.map((l) => {
        if (l.text == null) return l.description == null ? { label: l.label } : { label: l.label, description: l.description };
        const s = splitLevel(l.text);
        split.push(s.how);
        return { label: s.label, description: s.description };
      });
      if (split.length) warn("score-split", q.key, split.every((h) => h === "split") ? "Each level string was split at its first \": \": the text before is the `label`, the rest the `description`." : "Some level strings had no short \"label: \" prefix, so the label is the text cut to 60 characters and the description is the full string.");
      count(warn, fmt, "levels", q.key, out.levels.length);
    }
    questions.push(out);
  }
  count(warn, fmt, "questions", null, questions.length);
  return { model: fmt.default_model, input, questions };
}

export function sanitizeKey(key, pattern, max = 64) {
  if (!pattern) return key;
  const allowed = pattern.includes("_.-") ? /[^A-Za-z0-9_.-]/g : /[^A-Za-z0-9_-]/g;
  return String(key).replace(allowed, "_").slice(0, max) || "q";
}

function keyFor(q, fmt, warn, used) {
  let key = q.key;
  if (q.unnamed) warn("unnamed", key, `OpenAI question without \`name\`: generated the key \`${key}\`.`);
  if (fmt.key_pattern && !new RegExp(fmt.key_pattern).test(key)) {
    const max = /\{1,(\d+)\}/.exec(fmt.key_pattern);
    const k2 = sanitizeKey(key, fmt.key_pattern, max ? Number(max[1]) : 64);
    warn("key-invalid", q.key, `Key \`${key}\` doesn't match ${fmt.short}'s pattern, so it became \`${k2}\`.`);
    key = k2;
  }
  const maxLen = Number((/\{1,(\d+)\}/.exec(fmt.key_pattern || "") || [])[1]) || Infinity;
  let k = key;
  let n = 2;
  while (used.has(k)) { const suf = `_${n++}`; k = `${key.slice(0, Math.max(1, maxLen - suf.length))}${suf}`; }
  used.add(k);
  return k;
}

function serializeHistory(msgs) {
  return msgs.map((m) => {
    const c = typeof m.content === "string" ? m.content : Array.isArray(m.content) ? partsToText(m.content) : JSON.stringify(m);
    return `${m.role || m.type || "item"}: ${c}`;
  }).join("\n");
}

export function emitGemini(ir, fmt, warn) {
  let input;
  if (ir.input.kind === "text") input = ir.input.value;
  else if (ir.input.kind === "json") { input = JSON.stringify(ir.input.value); warn("json-stringified", null); }
  else if (ir.input.kind === "messages") { input = serializeHistory(ir.input.value); warn("history-serialized", null); }
  else { input = ir.input.value; warn("media-manual", null); }
  const questions = {};
  const used = new Set();
  let n = 0;
  for (const q of ir.questions) {
    if (q.kind === "box") { warn("box-unsupported", q.key); continue; }
    const key = keyFor(q, fmt, warn, used);
    if (q.instructionParts) warn("instructions-parts", q.key);
    const out = { type: fmt.types[q.kind], instructions: q.instructions };
    if (q.kind === "yesno") {
      if (q.yes || q.no) out.criteria = { true_description: q.yes || "", false_description: q.no || "" };
      warn("probability-range", q.key);
    }
    if (q.kind === "choice") {
      out.criteria = {};
      q.options.forEach((o) => { put(out.criteria, String(o.value), o.description ?? ""); });
      const keys = q.options.map((o) => String(o.value));
      const sorted = [...keys].sort(byteCompare);
      if (keys.join("\u0000") !== sorted.join("\u0000")) {
        const extra = keys.some((k) => /^none/i.test(k)) ? ` ${"Alphabetical sorting places a `none…` option ahead of keys like 'shipping'."}` : "";
        warn("option-order", q.key, `Gemini sorts option keys alphabetically, so your order isn't kept: ${sorted.join(", ")}.${extra}`);
      }
      count(warn, fmt, "choices", q.key, keys.length);
    }
    if (q.kind === "score") {
      if (q.levels.some((l) => l.text == null && l.label && l.description)) warn("score-merged", q.key);
      out.criteria = q.levels.map(levelText);
      count(warn, fmt, "levels", q.key, out.criteria.length);
    }
    put(questions, key, out);
    n += 1;
  }
  count(warn, fmt, "questions", null, n);
  return { model: fmt.default_model, input, questions };
}

export function emitSystemOne(ir, fmt, warn, variant) {
  let state;
  if (ir.input.kind === "text") state = ir.input.value;
  else if (ir.input.kind === "json") state = ir.input.value;
  else if (ir.input.kind === "messages") { state = serializeHistory(ir.input.value); warn("history-serialized", null, "Conversation serialized as `role: text` lines in `state`."); }
  else { state = ""; warn("media-manual", null); }
  const questions = {};
  const used = new Set();
  let n = 0;
  for (const q of ir.questions) {
    if (q.kind === "box" && variant !== "jev") { warn("box-unsupported", q.key); continue; }
    const key = keyFor(q, fmt, warn, used);
    const out = { type: q.kind === "box" ? "box" : fmt.types[q.kind], instructions: q.instructionParts || q.instructions };
    if (q.kind === "box") { put(questions, key, { ...q.raw, type: "box", instructions: out.instructions }); n += 1; continue; }
    if (q.kind === "yesno" && (q.yes || q.no)) out.criteria = { true: q.yes ?? null, false: q.no ?? null };
    if (q.kind === "choice") {
      out.criteria = {};
      q.options.forEach((o) => { put(out.criteria, String(o.value), o.description ?? null); });
      count(warn, fmt, "choices", q.key, q.options.length);
    }
    if (q.kind === "score") {
      if (q.levels.some((l) => l.text == null && l.label && l.description)) warn("score-merged", q.key);
      out.criteria = q.levels.map(levelText);
      count(warn, fmt, "levels", q.key, out.criteria.length);
    }
    put(questions, key, out);
    n += 1;
  }
  count(warn, fmt, "questions", null, n);
  return { model: fmt.default_model, state, questions };
}

function byteCompare(a, b) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  for (let i = 0; i < Math.min(ea.length, eb.length); i += 1) if (ea[i] !== eb[i]) return ea[i] - eb[i];
  return ea.length - eb.length;
}

function count(warn, fmt, what, key, n) {
  const lim = fmt.limits && fmt.limits[what];
  if (!lim) return;
  const [min, max] = lim;
  const names = { questions: "questions", choices: "options", levels: "levels" };
  if (max != null && n > max) warn("limit-exceeded", key, `${n} ${names[what]}: ${fmt.short} allows ${min}–${max}. The request is still emitted so you can split it.`);
  if (min != null && n < min) warn(what === "questions" ? "limit-exceeded" : "too-few", key, `${n} ${names[what]}: ${fmt.short} needs at least ${min}.`);
}
