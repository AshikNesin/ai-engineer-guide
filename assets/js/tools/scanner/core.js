// Deprecated model-ID scanner: find model IDs in pasted text and join them
// against data/retirements.json. Pure functions, unit-tested.
import { daysUntil } from "../shared/format.js";

const DATE_SUFFIX = /-(\d{8}|\d{4}-\d{2}-\d{2})$/;
const WATCH = new Set(["deprecated", "retired", "legacy"]);

/**
 * Build lookup maps from retirements.json `models`.
 * exact: every ID the official tables list.
 * alias: the same ID without its date suffix ("gpt-4o", "claude-sonnet-4-5"),
 *        when that alias isn't itself a listed ID.
 */
export function buildIndex(models) {
  const exact = new Map();
  const alias = new Map();
  for (const m of models) {
    if (!WATCH.has(m.status)) continue;
    for (const id of m.ids) exact.set(id.toLowerCase(), m);
  }
  const rank = (m) => (m.status === "deprecated" ? 2 : m.status === "retired" ? 1 : 0);
  for (const m of models) {
    if (!WATCH.has(m.status)) continue;
    for (const id of m.ids) {
      const base = id.replace(DATE_SUFFIX, "").toLowerCase();
      if (base === id.toLowerCase() || exact.has(base)) continue;
      const prev = alias.get(base);
      // Prefer the entry that's still upcoming, then the latest shutdown.
      if (!prev || rank(m) > rank(prev) || (rank(m) === rank(prev) && (m.shutdown || "") > (prev.shutdown || ""))) {
        alias.set(base, m);
      }
    }
  }
  return { exact, alias };
}

// Turn platform spellings into the provider's model ID.
export function normalize(token) {
  let t = token.toLowerCase();
  t = t.replace(/^(models|openai|anthropic|google|gemini|vertex_ai|azure|openrouter)\//, "");
  t = t.replace(/^(us|eu|apac|global)\.(?=anthropic\.)/, "");
  t = t.replace(/^anthropic\./, ""); // Amazon Bedrock: anthropic.claude-...-v1:0
  t = t.replace(/-v\d+(:\d+)?$/, "");
  t = t.replace(/@(\d{8})$/, "-$1"); // Vertex AI: claude-...@20250929
  return t;
}

const TOKEN = /[A-Za-z0-9][A-Za-z0-9._:@/-]*[A-Za-z0-9]/g;

/**
 * @returns {Array<{line, col, text, id, match: "exact"|"alias", model}>}
 */
export function scan(text, index) {
  const hits = [];
  text.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(TOKEN)) {
      const id = normalize(m[0]);
      const exact = index.exact.get(id);
      const model = exact || index.alias.get(id);
      if (model) hits.push({ line: i + 1, col: m.index + 1, text: m[0], id, match: exact ? "exact" : "alias", model });
    }
  });
  return hits;
}

/** Group hits by model ID, most urgent first (retired, then soonest shutdown). */
export function summarize(hits, today = new Date()) {
  const groups = new Map();
  for (const h of hits) {
    const g = groups.get(h.id) || { id: h.id, match: h.match, model: h.model, lines: [] };
    if (!g.lines.includes(h.line)) g.lines.push(h.line);
    groups.set(h.id, g);
  }
  const rows = [...groups.values()].map((g) => {
    const days = g.model.shutdown ? daysUntil(g.model.shutdown, today) : null;
    const retired = g.model.status === "retired" || (days !== null && days < 0 && ["exact", "earliest"].includes(g.model.shutdown_kind));
    return { ...g, days, retired };
  });
  const urgency = (r) => (r.retired ? -1e6 : r.model.status === "legacy" ? 1e6 : r.days ?? 9e5);
  return rows.sort((a, b) => urgency(a) - urgency(b) || a.id.localeCompare(b.id));
}

export function checklist(rows) {
  return rows.map((r) => {
    const when = r.retired ? `retired ${r.model.shutdown}` : r.model.shutdown ? `shuts down ${r.model.shutdown}${r.model.shutdown_kind === "earliest" ? " (earliest)" : ""}` : "date TBA";
    const repl = r.model.replacement?.text ? `, replace with ${r.model.replacement.text}` : "";
    return `- [ ] \`${r.id}\` (${when})${repl}, lines ${r.lines.join(", ")}`;
  }).join("\n");
}
