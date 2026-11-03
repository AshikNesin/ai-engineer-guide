// Walk every subschema of a JSON Schema with its JSON-pointer-ish path.
const MAP_KEYS = ["properties", "$defs", "definitions", "patternProperties", "dependentSchemas"];
const LIST_KEYS = ["anyOf", "allOf", "oneOf", "prefixItems"];
const ONE_KEYS = ["items", "not", "if", "then", "else", "contains", "additionalProperties"];

export function isObjectSchema(s) {
  if (!s || typeof s !== "object") return false;
  const t = s.type;
  return t === "object" || (Array.isArray(t) && t.includes("object")) || (t === undefined && !!s.properties);
}

export const ptr = (path) => (path.length ? "#/" + path.join("/") : "#");

/** visit(node, path, ctx) for every schema node; ctx = { depth, parentIsArray, parent, key } */
export function walk(schema, visit, path = [], ctx = { depth: 0, inArray: false }) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return;
  visit(schema, path, ctx);
  const depth = ctx.depth + (isObjectSchema(schema) ? 1 : 0);
  for (const k of MAP_KEYS) {
    if (schema[k] && typeof schema[k] === "object") {
      for (const [name, sub] of Object.entries(schema[k])) walk(sub, visit, [...path, k, name], { depth, inArray: ctx.inArray, mapKey: k });
    }
  }
  for (const k of LIST_KEYS) {
    if (Array.isArray(schema[k])) schema[k].forEach((sub, i) => walk(sub, visit, [...path, k, String(i)], { depth, inArray: ctx.inArray || k === "prefixItems" }));
  }
  for (const k of ONE_KEYS) {
    const sub = schema[k];
    if (sub && typeof sub === "object" && !Array.isArray(sub)) walk(sub, visit, [...path, k], { depth, inArray: ctx.inArray || k === "items" });
    if (k === "items" && Array.isArray(sub)) sub.forEach((s, i) => walk(s, visit, [...path, k, String(i)], { depth, inArray: true }));
  }
}
