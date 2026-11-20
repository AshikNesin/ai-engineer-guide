// Work out which API a pasted request belongs to, and parse the paste
// (JSON body, literal SDK call, or a log of several requests).
import { parseInput } from "../linter/parse.js";
import { jsonErrorPosition } from "./canon.js";

/** "anthropic" | "openai" | "chat" | "gemini" | "decision" | null */
export function detectApi(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const model = String(body.model || "");
  if ("questions" in body && ("state" in body || "input" in body)) return "decision";
  if ("contents" in body) return "gemini";
  if ("input" in body || "instructions" in body || "previous_response_id" in body) return "openai";
  if ("messages" in body) {
    if (/^claude/.test(model)) return "anthropic";
    if (/^(gpt|o\d|chatgpt)/.test(model)) return "chat";
    if ("system" in body || "max_tokens" in body || "thinking" in body) return "anthropic";
    return "anthropic";
  }
  return null;
}

/** Parse one request box. Returns {body, api} or throws an Error whose
 *  message is ready to show (with line/column for JSON errors). */
export function parseRequest(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Paste a request body.");
  if (raw.startsWith("{")) {
    try {
      const body = JSON.parse(raw);
      return { body, api: detectApi(body) };
    } catch (err) {
      // Maybe a JS/Python object literal: let the SDK parser try first.
      try {
        const p = parseInput(raw);
        return { body: p.body, api: detectApi(p.body) };
      } catch (_) {
        throw new Error(jsonErrorPosition(raw, err).message);
      }
    }
  }
  try {
    const p = parseInput(raw);
    return { body: p.body, api: detectApi(p.body) };
  } catch (err) {
    const msg = String(err.message || err);
    if (/variable/.test(msg)) throw new Error(`${msg} Or paste the JSON body your SDK sends (turn on debug logging).`);
    throw new Error(msg);
  }
}

/** Parse a log: a JSON array of request bodies, or JSONL (one per line). */
export function parseLog(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Paste a JSON array of request bodies, or one request per line (JSONL).");
  if (raw.startsWith("[")) {
    let arr;
    try { arr = JSON.parse(raw); } catch (err) { throw new Error(jsonErrorPosition(raw, err).message); }
    if (!Array.isArray(arr) || arr.some((x) => !x || typeof x !== "object")) throw new Error("The array must hold request objects.");
    return arr;
  }
  const out = [];
  String(text).split("\n").forEach((line, i) => {
    const l = line.trim();
    if (!l) return;
    let v;
    try { v = JSON.parse(l); } catch (err) {
      const pos = jsonErrorPosition(l, err);
      throw new Error(`Line ${i + 1}: ${pos.message.replace(/^Line 1, /, "")}`);
    }
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error(`Line ${i + 1}: each line must be one request object.`);
    out.push(v);
  });
  return out;
}
