// Decision request converter: format -> IR -> format, with a warning for
// every lossy step. Pure; tested in tests/decisions.test.mjs.
import { detectFormat, parse, emitOpenAI, emitGemini, emitSystemOne } from "./formats.js";

export const TARGETS = ["openai", "gemini", "jev", "clef"];

export function makeWarner(data) {
  const list = [];
  const warn = (code, questionKey, message) => {
    const w = data.warnings[code] || {};
    // One warning per code and question.
    if (list.some((x) => x.code === code && x.questionKey === (questionKey ?? null) && x.message === (message || w.text))) return;
    list.push({ code, questionKey: questionKey ?? null, message: message || w.text || code, sourceUrl: w.url || null });
  };
  return { list, warn };
}

/** Emit an IR as the target format. */
export function emit(ir, to, data, warn) {
  const fmt = data.formats[to];
  if (!fmt) throw new Error(`Unknown target format: ${to}`);
  let body;
  if (to === "openai") body = emitOpenAI(ir, fmt, warn);
  else if (to === "gemini") body = emitGemini(ir, fmt, warn);
  else body = emitSystemOne(ir, fmt, warn, to);
  warn("model-reset", null, `Model set to \`${fmt.default_model}\`, ${fmt.short}'s default; check that it's available to you.`);
  return body;
}

/**
 * @param {object} body decision request
 * @param {string|null} from "openai" | "gemini" | "jev" | "clef" (null = detect)
 * @param {string} to target
 */
export function convert(body, from, to, data) {
  const src = from || detectFormat(body);
  if (!src) throw new Error("Couldn't tell the format. Pick it in 'From'.");
  const { list, warn } = makeWarner(data);
  const ir = parse(body, src, warn);
  const out = emit(ir, to, data, warn);
  return { from: src, to, ir, body: out, warnings: list, curl: curl(out, to, data) };
}

/** curl snippet with $ENV_VAR placeholders only. */
export function curl(body, to, data) {
  const fmt = data.formats[to];
  const lines = [];
  if (fmt.endpoint_verified === false) lines.push("# The REST path is unconfirmed in Google's API reference; check it before use.");
  if (fmt.auth_verified === false) lines.push("# Auth header unconfirmed; check TypeSafe's docs.");
  const json = JSON.stringify(body, null, 2).replace(/'/g, "'\\''");
  lines.push(`curl ${fmt.endpoint.includes("$") ? `"${fmt.endpoint}"` : fmt.endpoint} \\`);
  for (const h of fmt.auth) lines.push(`  -H "${h}" \\`);
  lines.push(`  -H "Content-Type: application/json" \\`);
  lines.push(`  -d '${json}'`);
  return lines.join("\n");
}

/** Group warnings by question key (null = whole request). */
export function groupWarnings(warnings) {
  const groups = new Map();
  for (const w of warnings) {
    const k = w.questionKey ?? "";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(w);
  }
  return groups;
}
