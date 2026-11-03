// Validate a model output against a JSON Schema (the subset structured
// outputs use). Returns [{ path, message }]; [] means valid.
const FORMATS = {
  "date-time": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  uri: /^[a-z][a-z0-9+.-]*:/i,
};

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (Number.isInteger(v)) return "integer";
  return typeof v;
}

function resolve(root, ref) {
  if (ref === "#") return root;
  if (!ref.startsWith("#/")) return null;
  return ref.slice(2).split("/").reduce((n, k) => (n ? n[k.replace(/~1/g, "/").replace(/~0/g, "~")] : undefined), root);
}

export function validate(schema, value, root = schema, path = "$", depth = 0) {
  const errs = [];
  const err = (m) => errs.push({ path, message: m });
  if (depth > 50 || !schema || typeof schema !== "object") return errs;
  if (schema.$ref) {
    const target = resolve(root, schema.$ref);
    if (!target) return [{ path, message: `can't resolve $ref ${schema.$ref}` }];
    return validate(target, value, root, path, depth + 1);
  }
  const t = typeOf(value);
  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const ok = types.some((x) => x === t || (x === "number" && t === "integer"));
    if (!ok) { err(`expected ${types.join(" or ")}, got ${t}`); return errs; }
  }
  if (schema.enum && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value))) err(`must be one of ${JSON.stringify(schema.enum)}`);
  if ("const" in schema && JSON.stringify(schema.const) !== JSON.stringify(value)) err(`must equal ${JSON.stringify(schema.const)}`);
  if (schema.anyOf && !schema.anyOf.some((s) => validate(s, value, root, path, depth + 1).length === 0)) err("doesn't match any anyOf option");
  if (schema.oneOf && schema.oneOf.filter((s) => validate(s, value, root, path, depth + 1).length === 0).length !== 1) err("must match exactly one oneOf option");
  if (schema.allOf) schema.allOf.forEach((s) => errs.push(...validate(s, value, root, path, depth + 1)));
  if (t === "string") {
    if (schema.minLength != null && [...value].length < schema.minLength) err(`shorter than ${schema.minLength}`);
    if (schema.maxLength != null && [...value].length > schema.maxLength) err(`longer than ${schema.maxLength}`);
    if (schema.pattern) { try { if (!new RegExp(schema.pattern, "u").test(value)) err(`doesn't match pattern ${schema.pattern}`); } catch (_) { /* unsupported regex */ } }
    if (schema.format && FORMATS[schema.format] && !FORMATS[schema.format].test(value)) err(`not a valid ${schema.format}`);
  }
  if (t === "number" || t === "integer") {
    if (schema.minimum != null && value < schema.minimum) err(`less than ${schema.minimum}`);
    if (schema.maximum != null && value > schema.maximum) err(`greater than ${schema.maximum}`);
    if (schema.exclusiveMinimum != null && value <= schema.exclusiveMinimum) err(`must be > ${schema.exclusiveMinimum}`);
    if (schema.exclusiveMaximum != null && value >= schema.exclusiveMaximum) err(`must be < ${schema.exclusiveMaximum}`);
    if (schema.multipleOf && Math.abs(value / schema.multipleOf - Math.round(value / schema.multipleOf)) > 1e-9) err(`not a multiple of ${schema.multipleOf}`);
  }
  if (t === "array") {
    if (schema.minItems != null && value.length < schema.minItems) err(`fewer than ${schema.minItems} items`);
    if (schema.maxItems != null && value.length > schema.maxItems) err(`more than ${schema.maxItems} items`);
    const prefix = schema.prefixItems || [];
    value.forEach((v, i) => {
      const s = i < prefix.length ? prefix[i] : schema.items;
      if (s && typeof s === "object") errs.push(...validate(s, v, root, `${path}[${i}]`, depth + 1));
    });
  }
  if (t === "object") {
    const props = schema.properties || {};
    for (const k of schema.required || []) if (!(k in value)) err(`missing required "${k}"`);
    for (const [k, v] of Object.entries(value)) {
      if (k in props) errs.push(...validate(props[k], v, root, `${path}.${k}`, depth + 1));
      else if (schema.additionalProperties === false) err(`unexpected property "${k}"`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === "object") errs.push(...validate(schema.additionalProperties, v, root, `${path}.${k}`, depth + 1));
    }
  }
  return errs;
}
