// Turn pasted input into a request object. Accepts a JSON body, or a Python /
// TypeScript SDK call such as client.messages.create(model="...", ...).
// Pure functions, unit-tested in tests/linter.test.mjs.

export function detectApiFromText(text) {
  if (/\bmessages\s*\.\s*(create|stream|count_tokens|countTokens)\s*\(/.test(text)) return "messages";
  if (/\bchat\s*\.\s*completions\s*\.\s*(create|stream|parse)\s*\(/.test(text)) return "chat";
  if (/\bresponses\s*\.\s*(create|stream|parse)\s*\(/.test(text)) return "responses";
  return null;
}

export function detectApiFromBody(body) {
  const model = String(body.model || "");
  if ("input" in body || "instructions" in body || "previous_response_id" in body) return "responses";
  if (/^claude/.test(model) || "max_tokens" in body && "system" in body || "betas" in body) return "messages";
  if (/^claude/.test(model)) return "messages";
  if ("messages" in body) return /^(gpt|o\d|chatgpt)/.test(model) ? "chat" : "messages";
  return null;
}

// Find the argument text of the first `.create(` / `.stream(` / `.parse(` call.
function callArgs(text) {
  const m = /\.(create|stream|parse|count_tokens|countTokens)\s*\(/.exec(text);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  let quote = null;
  const start = i;
  for (; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if ("([{".includes(ch)) depth += 1;
    else if (")]}".includes(ch)) {
      depth -= 1;
      if (depth === 0) return text.slice(start, i);
    }
  }
  return null;
}

// Convert a Python or JS object/kwargs literal into JSON text, outside strings.
function literalToJson(src, kwargs) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      // Re-emit any string as a JSON double-quoted string.
      let j = i + 1;
      let s = "";
      while (j < src.length && src[j] !== ch) {
        if (src[j] === "\\" && j + 1 < src.length) {
          s += src[j] + src[j + 1];
          j += 2;
          continue;
        }
        s += src[j];
        j += 1;
      }
      const inner = ch === '"' ? s : s.replace(/\\'/g, "'").replace(/"/g, '\\"');
      out += `"${inner.replace(/\n/g, "\\n")}"`;
      i = j + 1;
      continue;
    }
    if (ch === "#" || (ch === "/" && src[i + 1] === "/")) {
      while (i < src.length && src[i] !== "\n") i += 1;
      continue;
    }
    const word = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
    if (word) {
      const w = word[0];
      const rest = src.slice(i + w.length);
      if (kwargs && /^\s*=(?!=)/.test(rest)) {
        out += `"${w}":`;
        i += w.length + rest.indexOf("=") + 1;
        continue;
      }
      if (/^\s*:/.test(rest) && /[{,]\s*$/.test(out)) {
        out += `"${w}"`;
      } else if (w === "True" || w === "true") out += "true";
      else if (w === "False" || w === "false") out += "false";
      else if (w === "None" || w === "null" || w === "undefined") out += "null";
      else throw new Error(`"${w}" is a variable. Paste the request with literal values, or the JSON body.`);
      i += w.length;
      continue;
    }
    out += ch;
    i += 1;
  }
  // Drop trailing commas before } or ].
  return out.replace(/,(\s*[}\]])/g, "$1");
}

/**
 * @returns {{ body: object, api: string|null, raw: string, kind: "json"|"sdk" }}
 */
export function parseInput(text) {
  const raw = text.trim();
  if (!raw) throw new Error("Paste a request body or an SDK call.");
  try {
    const body = JSON.parse(raw);
    if (body && typeof body === "object" && !Array.isArray(body)) {
      return { body, api: detectApiFromBody(body), raw, kind: "json" };
    }
  } catch (_) {
    /* not plain JSON; try an SDK call or object literal */
  }
  const api = detectApiFromText(raw);
  const args = callArgs(raw);
  let jsonText;
  if (args !== null) {
    const trimmed = args.trim();
    jsonText = trimmed.startsWith("{")
      ? literalToJson(trimmed, false)
      : `{${literalToJson(trimmed, true).replace(/,\s*$/, "")}}`;
  } else if (raw.startsWith("{")) {
    jsonText = literalToJson(raw, false);
  } else {
    throw new Error("Couldn't find a request. Paste the JSON body or a client.messages.create(...) / chat.completions.create(...) call.");
  }
  let body;
  try {
    body = JSON.parse(jsonText);
  } catch (err) {
    throw new Error("Couldn't parse that snippet. Paste the JSON request body instead.");
  }
  // Python SDK: extra_headers / extra_body are merged by the client.
  if (body.extra_body && typeof body.extra_body === "object") Object.assign(body, body.extra_body);
  delete body.extra_body;
  return { body, api: api || detectApiFromBody(body), raw, kind: "sdk" };
}
