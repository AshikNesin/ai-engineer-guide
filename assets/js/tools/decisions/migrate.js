// Classifier JSON Schema -> decision questions (IR). Deterministic mapping,
// PRD §10.5. Pure; tested in tests/decisions.test.mjs.
import { isObjectSchema } from "../schema/walk.js";

/** Unwrap response_format / text.format / tool wrappers. */
export function unwrapSchema(x) {
  if (!x || typeof x !== "object") return null;
  if (x.type === "json_schema" && x.json_schema && x.json_schema.schema) return x.json_schema.schema;
  if (x.response_format) return unwrapSchema(x.response_format);
  if (x.text && x.text.format) return unwrapSchema(x.text.format);
  if (x.format && x.format.schema) return x.format.schema;
  if (x.type === "json_schema" && x.schema) return x.schema;
  if (x.input_schema) return x.input_schema;
  if (x.parameters && (x.name || x.type === "function")) return x.parameters;
  if (x.function && x.function.parameters) return x.function.parameters;
  return x;
}

export const humanize = (path) => path.join(" ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase().trim();
const keyOf = (path) => path.join("_").replace(/[^A-Za-z0-9_-]/g, "_");
const CONF = /confidence|probability|certainty/i;

function resolve(s, root, depth = 0) {
  if (!s || typeof s !== "object" || !s.$ref || depth > 20) return s;
  const m = /^#\/(\$defs|definitions)\/(.+)$/.exec(s.$ref);
  if (!m) return s;
  const target = root[m[1]] && root[m[1]][m[2]];
  return target ? resolve({ ...target, ...Object.fromEntries(Object.entries(s).filter(([k]) => k !== "$ref")) }, root, depth + 1) : s;
}

/** Split nullable unions: returns { schema, nullable }. */
function unNull(s, root) {
  s = resolve(s, root);
  if (Array.isArray(s.type) && s.type.includes("null")) {
    const rest = s.type.filter((t) => t !== "null");
    const enumVals = Array.isArray(s.enum) ? s.enum.filter((v) => v !== null) : s.enum;
    return { schema: { ...s, type: rest.length === 1 ? rest[0] : rest, ...(enumVals ? { enum: enumVals } : {}) }, nullable: true };
  }
  for (const k of ["anyOf", "oneOf"]) {
    if (Array.isArray(s[k]) && s[k].some((x) => resolve(x, root).type === "null")) {
      const rest = s[k].filter((x) => resolve(x, root).type !== "null");
      if (rest.length === 1) {
        const { [k]: _drop, ...outer } = s;
        return { schema: { ...outer, ...resolve(rest[0], root), description: s.description || resolve(rest[0], root).description }, nullable: true };
      }
    }
  }
  if (Array.isArray(s.enum) && s.enum.includes(null)) return { schema: { ...s, enum: s.enum.filter((v) => v !== null) }, nullable: true };
  return { schema: s, nullable: false };
}

/** Options for an enum-like string: enum, or oneOf of consts (with descriptions). */
function enumOptions(s) {
  if (Array.isArray(s.enum)) return s.enum.map((v) => ({ value: v, description: null }));
  if (Array.isArray(s.oneOf) && s.oneOf.length && s.oneOf.every((x) => x && "const" in x)) return s.oneOf.map((x) => ({ value: x.const, description: x.description ?? null }));
  return null;
}

/**
 * @param {object} input schema (or wrapper)
 * @param {object} opts { ordered: {key: true}, levelLimit: 10 }
 * @returns {{ ir, mapping: [{field, key, type, flags}], keep: string[], dropped: [{field, flag}] }}
 */
export function migrate(input, opts = {}) {
  const root = unwrapSchema(input);
  if (!root || typeof root !== "object") throw new Error("Paste a JSON Schema, or a structured-output / tool definition that contains one.");
  const levelLimit = opts.levelLimit || 10;
  const ordered = opts.ordered || {};
  const questions = [];
  const mapping = [];
  const keep = [];
  const dropped = [];

  const visit = (raw, path) => {
    const { schema: s, nullable } = unNull(raw, root);
    const field = path.join(".");
    const key = keyOf(path);
    const human = humanize(path);
    const desc = s.description || "";
    const t = Array.isArray(s.type) ? s.type[0] : s.type;
    const flags = [];
    if (isObjectSchema(s) && s.properties) {
      for (const [name, sub] of Object.entries(s.properties)) visit(sub, [...path, name]);
      return;
    }
    const opts2 = (t === "string" || t === undefined) ? enumOptions(s) : null;
    if (opts2 && opts2.length >= 2) {
      if (!desc) flags.push("write-a-question");
      if (nullable) { opts2.push({ value: "other", description: null }); flags.push("added-other"); }
      if (ordered[key]) {
        questions.push({ key, kind: "score", instructions: desc || `Rate ${human}.`, instructionParts: null, levels: opts2.filter((o) => o.value !== "other").map((o) => ({ label: String(o.value), description: o.description })) });
        mapping.push({ field, key, type: "score", flags: [...flags.filter((f) => f !== "added-other"), "describe-levels"], orderable: true });
      } else {
        questions.push({ key, kind: "choice", instructions: desc || `Which ${human} applies?`, instructionParts: null, options: opts2 });
        mapping.push({ field, key, type: "choice", flags, orderable: true });
      }
      return;
    }
    if (t === "boolean") {
      if (!desc) flags.push("write-a-question");
      questions.push({ key, kind: "yesno", instructions: desc || `Is ${human} true?`, instructionParts: null, yes: null, no: null });
      mapping.push({ field, key, type: "yes/no", flags });
      return;
    }
    if (t === "integer") {
      let vals = null;
      if (Array.isArray(s.enum) && s.enum.every(Number.isInteger)) vals = s.enum;
      else if (Number.isInteger(s.minimum) && Number.isInteger(s.maximum) && s.maximum >= s.minimum && s.maximum - s.minimum + 1 <= levelLimit) {
        vals = [];
        for (let v = s.minimum; v <= s.maximum; v += 1) vals.push(v);
      }
      if (vals && vals.length >= 2) {
        questions.push({ key, kind: "score", instructions: desc || `Rate ${human}.`, instructionParts: null, levels: vals.map((v) => ({ label: String(v), description: null })) });
        mapping.push({ field, key, type: "score", flags: ["describe-levels"] });
        return;
      }
    }
    if (t === "array" && s.items) {
      const it = unNull(s.items, root).schema;
      const vals = enumOptions(it);
      if (vals && vals.length) {
        for (const o of vals) {
          const k = `${key}_${String(o.value).replace(/[^A-Za-z0-9_-]/g, "_")}`;
          questions.push({ key: k, kind: "yesno", instructions: `Does '${o.value}' apply?${desc ? ` ${desc}` : ""}`, instructionParts: null, yes: o.description, no: null });
          mapping.push({ field: `${field}[${JSON.stringify(o.value)}]`, key: k, type: "yes/no", flags: ["multi-label-split"] });
        }
        return;
      }
    }
    if (t === "number" && CONF.test(path[path.length - 1] || "")) {
      dropped.push({ field, flag: "use-answer-confidence" });
      return;
    }
    keep.push(field);
  };

  if (isObjectSchema(root) && root.properties) for (const [name, sub] of Object.entries(root.properties)) visit(sub, [name]);
  else visit(root, ["value"]);
  if (!questions.length) throw new Error("Nothing here maps to a decision question. Every field needs free text.");
  return { ir: { input: { kind: "text", value: "<paste the text you classify>" }, questions }, mapping, keep, dropped };
}
