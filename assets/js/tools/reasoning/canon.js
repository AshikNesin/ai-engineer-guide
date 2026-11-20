// Canonical JSON and small text helpers for the reasoning prefix checker.
// Pure functions, unit-tested in tests/reasoning.test.mjs.

/** Stable JSON: keys sorted recursively, every `cache_control` key removed
 *  (Anthropic: "cache_control markers ... aren't content that Claude reads"). */
export function canon(x, { dropKeys = ["cache_control"] } = {}) {
  const walk = (v) => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out = {};
      for (const k of Object.keys(v).sort()) {
        if (dropKeys.includes(k)) continue;
        out[k] = walk(v[k]);
      }
      return out;
    }
    return v;
  };
  return JSON.stringify(walk(x === undefined ? null : x));
}

/** True when the two values differ only in `cache_control` markers. */
export function onlyCacheControlDiffers(a, b) {
  return canon(a) === canon(b) && canon(a, { dropKeys: [] }) !== canon(b, { dropKeys: [] });
}

/** Word-level diff of two strings: [{op: "eq"|"del"|"ins", text}]. LCS on
 *  word tokens, capped so huge inputs fall back to a whole-string replace. */
export function wordDiff(a, b) {
  const ta = String(a).split(/(\s+)/).filter((s) => s !== "");
  const tb = String(b).split(/(\s+)/).filter((s) => s !== "");
  // Trim the common head and tail first: most edits are small.
  let head = 0;
  while (head < ta.length && head < tb.length && ta[head] === tb[head]) head += 1;
  let tail = 0;
  while (tail < ta.length - head && tail < tb.length - head && ta[ta.length - 1 - tail] === tb[tb.length - 1 - tail]) tail += 1;
  const ma = ta.slice(head, ta.length - tail);
  const mb = tb.slice(head, tb.length - tail);
  const out = [];
  if (head) out.push({ op: "eq", text: ta.slice(0, head).join("") });
  if (ma.length * mb.length > 250000) {
    if (ma.length) out.push({ op: "del", text: ma.join("") });
    if (mb.length) out.push({ op: "ins", text: mb.join("") });
  } else {
    const n = ma.length;
    const m = mb.length;
    const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i -= 1) {
      for (let j = m - 1; j >= 0; j -= 1) {
        dp[i][j] = ma[i] === mb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    const push = (op, text) => {
      const last = out[out.length - 1];
      if (last && last.op === op) last.text += text;
      else out.push({ op, text });
    };
    while (i < n || j < m) {
      if (i < n && j < m && ma[i] === mb[j]) { push("eq", ma[i]); i += 1; j += 1; }
      else if (i < n && (j === m || dp[i + 1][j] >= dp[i][j + 1])) { push("del", ma[i]); i += 1; }
      else { push("ins", mb[j]); j += 1; }
    }
  }
  if (tail) {
    const text = ta.slice(ta.length - tail).join("");
    const last = out[out.length - 1];
    if (last && last.op === "eq") last.text += text;
    else out.push({ op: "eq", text });
  }
  return out;
}

/** Map a JSON.parse error to "Line L, column C: message". */
export function jsonErrorPosition(text, err) {
  const msg = String(err && err.message || err);
  let pos = null;
  const m = /position (\d+)/.exec(msg);
  if (m) pos = Number(m[1]);
  const lc = /line (\d+) column (\d+)/.exec(msg);
  const clean = msg.replace(/^JSON\.parse: /, "").replace(/ in JSON at position \d+.*$/, "").replace(/ at line \d+ column \d+.*$/, "").replace(/\s*\(line \d+ column \d+\)$/, "");
  if (lc) return { line: Number(lc[1]), column: Number(lc[2]), message: `Line ${lc[1]}, column ${lc[2]}: ${clean}` };
  if (pos === null) return { line: null, column: null, message: clean };
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const column = pos - before.lastIndexOf("\n");
  return { line, column, message: `Line ${line}, column ${column}: ${clean}` };
}

/** Read a dotted path like "messages.1.content.0" from an object. */
export function getPath(obj, path) {
  let cur = obj;
  for (const part of String(path).split(".")) {
    if (cur == null) return undefined;
    cur = cur[/^\d+$/.test(part) ? Number(part) : part];
  }
  return cur;
}

/** Short one-line preview of a value for tables. */
export function preview(v, max = 80) {
  let s;
  if (typeof v === "string") s = v;
  else if (v && typeof v === "object" && typeof v.text === "string") s = v.text;
  else if (v && typeof v === "object" && typeof v.thinking === "string") s = v.thinking || "(empty thinking text)";
  else s = JSON.stringify(v);
  s = String(s).replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
