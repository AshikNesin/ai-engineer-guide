// Structured output schema checker: rules from data/schema_rules.json.
// Each check returns [{ path, message }]; fixable rules also have a fixer.
import { walk, isObjectSchema, ptr } from "./walk.js";

const OPENAI_FORMATS = new Set(["date-time", "time", "date", "duration", "email", "hostname", "ipv4", "ipv6", "uuid"]);
const ANTHROPIC_FORMATS = new Set(["date-time", "time", "date", "duration", "email", "hostname", "uri", "ipv4", "ipv6", "uuid"]);
const GEMINI_TYPES = new Set(["string", "number", "integer", "boolean", "object", "array", "null"]);
const GEMINI_IGNORED = ["minLength", "maxLength", "minProperties", "maxProperties", "uniqueItems", "contains", "minContains", "maxContains",
  "min_length", "max_length", "min_properties", "max_properties", "unique_items", "min_contains", "max_contains"];
const NUMERIC = ["minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf"];
const STRING_LEN = ["minLength", "maxLength"];
const COMPOSITION = ["allOf", "not", "dependentRequired", "dependentSchemas", "if", "then", "else"];

function collect(schema, fn) {
  const out = [];
  walk(schema, (node, path, ctx) => {
    const r = fn(node, path, ctx);
    if (r) out.push(...(Array.isArray(r) ? r : [r]));
  });
  return out;
}

const issue = (path, message) => ({ path: ptr(path), message });

function localRefs(schema) {
  const refs = [];
  walk(schema, (node, path) => { if (typeof node.$ref === "string") refs.push({ ref: node.$ref, path }); });
  return refs;
}

// A local ref creates a cycle when it points at "#" or at a def that
// (directly or indirectly) refers back to itself or one of its ancestors.
function recursiveRefs(schema) {
  const out = [];
  for (const { ref, path } of localRefs(schema)) {
    if (!ref.startsWith("#")) continue;
    const target = ref === "#" ? [] : ref.slice(2).split("/");
    const isAncestor = target.length <= path.length && target.every((seg, i) => path[i] === seg);
    if (isAncestor) out.push(issue(path, `$ref "${ref}" points back to a schema that contains it`));
  }
  return out;
}

export const CHECKS = {
  rootObject: (s) => (s.type !== "object" || s.anyOf ? [issue([], s.anyOf ? "Root uses anyOf" : `Root type is ${JSON.stringify(s.type)}`)] : []),
  additionalPropertiesFalse: (s) => collect(s, (n, p) => (isObjectSchema(n) && n.additionalProperties !== false ? issue(p, n.additionalProperties === undefined ? "additionalProperties is missing" : `additionalProperties is ${JSON.stringify(n.additionalProperties)}`) : null)),
  allRequired: (s) => collect(s, (n, p) => {
    if (!isObjectSchema(n) || !n.properties) return null;
    const req = new Set(n.required || []);
    const missing = Object.keys(n.properties).filter((k) => !req.has(k));
    return missing.length ? issue(p, `Not in required: ${missing.join(", ")}`) : null;
  }),
  openaiComposition: (s) => collect(s, (n, p) => COMPOSITION.filter((k) => k in n).map((k) => issue(p, `Uses ${k}`))),
  openaiLimits: (s) => {
    let props = 0, depth = 0, enums = 0, chars = 0;
    walk(s, (n, p, ctx) => {
      if (n.properties) {
        props += Object.keys(n.properties).length;
        chars += Object.keys(n.properties).join("").length;
      }
      for (const k of ["$defs", "definitions"]) if (n[k]) chars += Object.keys(n[k]).join("").length;
      if (isObjectSchema(n)) depth = Math.max(depth, ctx.depth + 1);
      if (Array.isArray(n.enum)) {
        enums += n.enum.length;
        chars += n.enum.filter((v) => typeof v === "string").join("").length;
      }
      if (typeof n.const === "string") chars += n.const.length;
    });
    const out = [];
    if (props > 5000) out.push(issue([], `${props} object properties (limit 5,000)`));
    if (depth > 10) out.push(issue([], `${depth} levels of object nesting (limit 10)`));
    if (enums > 1000) out.push(issue([], `${enums} enum values (limit 1,000)`));
    if (chars > 120000) out.push(issue([], `${chars} characters of names and enum values (limit 120,000)`));
    return out;
  },
  openaiFormat: (s) => collect(s, (n, p) => (typeof n.format === "string" && !OPENAI_FORMATS.has(n.format) ? issue(p, `format "${n.format}"`) : null)),
  anthropicNumeric: (s) => collect(s, (n, p) => NUMERIC.filter((k) => k in n).map((k) => issue(p, `Uses ${k}`))),
  anthropicStringLength: (s) => collect(s, (n, p) => STRING_LEN.filter((k) => k in n).map((k) => issue(p, `Uses ${k}`))),
  anthropicArray: (s) => collect(s, (n, p) => {
    const out = [];
    if ("minItems" in n && ![0, 1].includes(n.minItems)) out.push(issue(p, `minItems is ${n.minItems}`));
    for (const k of ["maxItems", "uniqueItems", "contains", "minContains", "maxContains"]) if (k in n) out.push(issue(p, `Uses ${k}`));
    return out;
  }),
  recursive: recursiveRefs,
  externalRef: (s) => localRefs(s).filter(({ ref }) => !ref.startsWith("#")).map(({ ref, path }) => issue(path, `$ref "${ref}"`)),
  complexEnum: (s) => collect(s, (n, p) => (Array.isArray(n.enum) && n.enum.some((v) => v !== null && typeof v === "object") ? issue(p, "enum contains an object or array") : null)),
  allOfRef: (s) => collect(s, (n, p) => (Array.isArray(n.allOf) && n.allOf.some((x) => x && x.$ref) ? issue(p, "allOf contains a $ref") : null)),
  anthropicOptional: (s) => {
    let n = 0;
    walk(s, (node) => { if (isObjectSchema(node) && node.properties) n += Object.keys(node.properties).filter((k) => !(node.required || []).includes(k)).length; });
    return n > 24 ? [issue([], `${n} optional parameters in this schema alone (limit 24 per request)`)] : [];
  },
  anthropicUnions: (s) => {
    let n = 0;
    walk(s, (node, path, ctx) => { if (ctx.mapKey === "properties" && (Array.isArray(node.type) || Array.isArray(node.anyOf))) n += 1; });
    return n > 16 ? [issue([], `${n} parameters with union types in this schema alone (limit 16 per request)`)] : [];
  },
  anthropicFormat: (s) => collect(s, (n, p) => (typeof n.format === "string" && !ANTHROPIC_FORMATS.has(n.format) ? issue(p, `format "${n.format}"`) : null)),
  anthropicRegex: (s) => collect(s, (n, p) => {
    if (typeof n.pattern !== "string") return null;
    const bad = [];
    if (/\\[1-9]/.test(n.pattern)) bad.push("backreference");
    if (/\(\?<?[=!]/.test(n.pattern)) bad.push("lookaround");
    if (/\\[bB]/.test(n.pattern)) bad.push("word boundary");
    return bad.length ? issue(p, `pattern uses ${bad.join(", ")}`) : null;
  }),
  geminiIgnored: (s) => collect(s, (n, p) => GEMINI_IGNORED.filter((k) => k in n).map((k) => issue(p, `${k} is ignored`))),
  geminiType: (s) => collect(s, (n, p) => {
    const types = Array.isArray(n.type) ? n.type : n.type === undefined ? [] : [n.type];
    const bad = types.filter((t) => !GEMINI_TYPES.has(t));
    return bad.length ? issue(p, `type ${bad.join(", ")}`) : null;
  }),
  geminiComplexity: (s) => collect(s, (n, p, ctx) => {
    const out = [];
    if (Array.isArray(n.enum) && n.enum.length > 100) out.push(issue(p, `${n.enum.length} enum values`));
    if (Array.isArray(n.anyOf) && n.anyOf.length > 10) out.push(issue(p, `anyOf with ${n.anyOf.length} alternatives`));
    if (ctx.inArray && typeof n.maxItems === "number" && n.maxItems > 100) out.push(issue(p, `nested array maxItems ${n.maxItems}`));
    return out;
  }),
};

// ---- fixes ------------------------------------------------------------------
function describe(node, notes) {
  if (!notes.length) return;
  const extra = `(${notes.join(", ")})`;
  node.description = node.description ? `${node.description} ${extra}` : extra;
}

function makeNullable(prop) {
  if (typeof prop.type === "string") return prop.type === "null" ? prop : { ...prop, type: [prop.type, "null"] };
  if (Array.isArray(prop.type)) return prop.type.includes("null") ? prop : { ...prop, type: [...prop.type, "null"] };
  if (Array.isArray(prop.anyOf)) return prop.anyOf.some((x) => x.type === "null") ? prop : { ...prop, anyOf: [...prop.anyOf, { type: "null" }] };
  return { anyOf: [prop, { type: "null" }] };
}

function moveToDescription(keys) {
  return (n) => {
    const notes = [];
    for (const k of keys) if (k in n) { notes.push(`${k}: ${JSON.stringify(n[k])}`); delete n[k]; }
    describe(n, notes);
  };
}

export const FIXES = {
  additionalPropertiesFalse: (n) => { if (isObjectSchema(n)) n.additionalProperties = false; },
  allRequired: (n) => {
    if (!isObjectSchema(n) || !n.properties) return;
    const req = new Set(n.required || []);
    for (const k of Object.keys(n.properties)) {
      if (!req.has(k)) n.properties[k] = makeNullable(n.properties[k]);
    }
    n.required = Object.keys(n.properties);
  },
  anthropicNumeric: moveToDescription(NUMERIC),
  anthropicStringLength: moveToDescription(STRING_LEN),
  anthropicArray: (n) => {
    const notes = [];
    if ("minItems" in n && ![0, 1].includes(n.minItems)) { notes.push(`minItems: ${n.minItems}`); n.minItems = 1; }
    for (const k of ["maxItems", "uniqueItems", "contains", "minContains", "maxContains"]) if (k in n) { notes.push(`${k}: ${JSON.stringify(n[k])}`); delete n[k]; }
    describe(n, notes);
  },
  geminiIgnored: (n) => { GEMINI_IGNORED.forEach((k) => delete n[k]); },
};

export function checkSchema(schema, target, rules) {
  const findings = [];
  for (const rule of rules.filter((r) => r.target === target)) {
    const fn = CHECKS[rule.check];
    if (!fn) continue;
    const issues = fn(schema);
    if (issues.length) findings.push({ rule, issues });
  }
  return findings;
}

export function fixSchema(schema, findings) {
  const out = JSON.parse(JSON.stringify(schema));
  const checks = findings.filter((f) => f.rule.autofix && FIXES[f.rule.check]).map((f) => f.rule.check);
  if (!checks.length) return out;
  // Apply node fixes bottom-up so replaced child schemas are visited first.
  const nodes = [];
  walk(out, (n) => nodes.push(n));
  for (const n of nodes.reverse()) for (const c of checks) FIXES[c](n);
  return out;
}

/** Pull the JSON Schema out of common wrappers (response_format, tools, MCP). */
export function extractSchema(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (obj.json_schema?.schema) return obj.json_schema.schema;
  if (obj.response_format) return extractSchema(obj.response_format);
  if (obj.text?.format?.schema) return obj.text.format.schema;
  if (obj.format?.schema) return obj.format.schema;
  if (obj.function?.parameters) return obj.function.parameters;
  if (obj.input_schema) return obj.input_schema;
  if (obj.inputSchema) return obj.inputSchema;
  if (obj.parameters && obj.name) return obj.parameters;
  if (obj.schema && !obj.type) return obj.schema;
  return obj;
}
