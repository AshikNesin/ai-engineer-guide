// Schema checker rules, auto-fixes, output validator and tool converter.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkSchema, fixSchema, extractSchema, CHECKS } from "../schema/check.js";
import { validate } from "../schema/validate.js";
import { parseTools, toFormat } from "../schema/convert.js";

const data = JSON.parse(readFileSync(new URL("../../../../data/schema_rules.json", import.meta.url), "utf8"));
const ids = (schema, target) => checkSchema(schema, target, data.rules).map((f) => f.rule.id).sort();

const ok = { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false };

test("rules are well formed", () => {
  for (const r of data.rules) {
    assert.ok(CHECKS[r.check], r.id);
    assert.ok(r.source.url.startsWith("https://") && r.source.quote, r.id);
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("a strict-ready schema passes every target", () => {
  for (const t of ["openai", "anthropic", "gemini"]) assert.deepEqual(ids(ok, t), [], t);
});

// One case per rule: [rule id, target, failing schema]
const CASES = [
  ["openai-root-object", "openai", { anyOf: [ok, ok] }],
  ["openai-additional-properties", "openai", { type: "object", properties: { id: { type: "string" } }, required: ["id"] }],
  ["openai-all-required", "openai", { type: "object", properties: { id: { type: "string" }, note: { type: "string" } }, required: ["id"], additionalProperties: false }],
  ["openai-unsupported-composition", "openai", { ...ok, properties: { id: { allOf: [{ type: "string" }] } } }],
  ["openai-size-limits", "openai", { ...ok, properties: { id: { type: "string", enum: Array.from({ length: 1001 }, (_, i) => `v${i}`) } } }],
  ["openai-string-format", "openai", { ...ok, properties: { id: { type: "string", format: "uri" } } }],
  ["anthropic-additional-properties", "anthropic", { type: "object", properties: {}, additionalProperties: true }],
  ["anthropic-numeric-constraints", "anthropic", { ...ok, properties: { id: { type: "integer", minimum: 1 } } }],
  ["anthropic-string-length", "anthropic", { ...ok, properties: { id: { type: "string", maxLength: 10 } } }],
  ["anthropic-array-constraints", "anthropic", { ...ok, properties: { id: { type: "array", items: { type: "string" }, minItems: 2 } } }],
  ["anthropic-recursive", "anthropic", { ...ok, properties: { id: { type: "array", items: { $ref: "#" } } } }],
  ["anthropic-external-ref", "anthropic", { ...ok, properties: { id: { $ref: "https://example.com/s.json" } } }],
  ["anthropic-complex-enum", "anthropic", { ...ok, properties: { id: { enum: [{ a: 1 }] } } }],
  ["anthropic-allof-ref", "anthropic", { ...ok, $defs: { x: { type: "string" } }, properties: { id: { allOf: [{ $ref: "#/$defs/x" }] } } }],
  ["anthropic-optional-limit", "anthropic", { type: "object", additionalProperties: false, properties: Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`p${i}`, { type: "string" }])) }],
  ["anthropic-union-limit", "anthropic", { type: "object", additionalProperties: false, required: Array.from({ length: 17 }, (_, i) => `p${i}`), properties: Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`p${i}`, { type: ["string", "null"] }])) }],
  ["anthropic-string-format", "anthropic", { ...ok, properties: { id: { type: "string", format: "regex" } } }],
  ["anthropic-regex", "anthropic", { ...ok, properties: { id: { type: "string", pattern: "^(a)\\1$" } } }],
  ["gemini-ignored-constraints", "gemini", { ...ok, properties: { id: { type: "string", minLength: 3 } } }],
  ["gemini-unsupported-type", "gemini", { ...ok, properties: { id: { type: "date" } } }],
  ["gemini-complexity", "gemini", { ...ok, properties: { id: { type: "string", enum: Array.from({ length: 101 }, (_, i) => `v${i}`) } } }],
];

test("every rule has a case", () => {
  assert.deepEqual(CASES.map((c) => c[0]).sort(), data.rules.map((r) => r.id).sort());
});

for (const [id, target, schema] of CASES) {
  test(`rule ${id}`, () => {
    assert.ok(ids(schema, target).includes(id), `${id} not triggered`);
    const rule = data.rules.find((r) => r.id === id);
    if (rule.autofix) {
      const fixed = fixSchema(schema, checkSchema(schema, target, data.rules));
      assert.ok(!ids(fixed, target).includes(id), `${id} still triggered after fix`);
    }
  });
}

test("OpenAI auto-fix makes optional fields nullable and required", () => {
  const s = { type: "object", properties: { id: { type: "string" }, note: { type: "string" } }, required: ["id"] };
  const fixed = fixSchema(s, checkSchema(s, "openai", data.rules));
  assert.deepEqual(fixed, { type: "object", properties: { id: { type: "string" }, note: { type: ["string", "null"] } }, required: ["id", "note"], additionalProperties: false });
});

test("Anthropic auto-fix moves constraints into the description", () => {
  const s = { ...ok, properties: { id: { type: "integer", description: "Age", minimum: 0, maximum: 130 } } };
  const fixed = fixSchema(s, checkSchema(s, "anthropic", data.rules));
  assert.equal(fixed.properties.id.description, "Age (minimum: 0, maximum: 130)");
  assert.ok(!("minimum" in fixed.properties.id));
});

test("extracts schemas from wrappers", () => {
  assert.deepEqual(extractSchema({ type: "json_schema", json_schema: { name: "x", strict: true, schema: ok } }), ok);
  assert.deepEqual(extractSchema({ name: "t", input_schema: ok }), ok);
  assert.deepEqual(extractSchema({ type: "function", function: { name: "t", parameters: ok } }), ok);
  assert.deepEqual(extractSchema(ok), ok);
});

test("validator", () => {
  const s = { type: "object", additionalProperties: false, required: ["n", "tags"], $defs: { tag: { type: "string", enum: ["a", "b"] } },
    properties: { n: { type: "integer", minimum: 1 }, tags: { type: "array", items: { $ref: "#/$defs/tag" } }, when: { type: ["string", "null"], format: "date" } } };
  assert.deepEqual(validate(s, { n: 2, tags: ["a"], when: null }), []);
  const errs = validate(s, { n: 0, tags: ["c"], extra: 1, when: "tomorrow" }).map((e) => `${e.path} ${e.message}`);
  assert.ok(errs.includes("$.n less than 1"));
  assert.ok(errs.some((e) => e.startsWith("$.tags[0] must be one of")));
  assert.ok(errs.includes('$ unexpected property "extra"'));
  assert.ok(errs.includes("$.when not a valid date"));
  assert.deepEqual(validate({ type: "number" }, 3), []);
  assert.equal(validate({ type: "integer" }, 3.5).length, 1);
});

test("tool converter round trips and warns about lost fields", () => {
  const anthropic = { name: "get_invoice", description: "Fetch", input_schema: ok, strict: true, cache_control: { type: "ephemeral" } };
  const { tools, from } = parseTools({ tools: [anthropic] });
  assert.equal(from, "anthropic");
  const chat = toFormat(tools, "openai-chat");
  assert.deepEqual(chat.output, { type: "function", function: { name: "get_invoice", description: "Fetch", parameters: ok, strict: true } });
  assert.ok(chat.warnings.some((w) => w.includes("cache_control")));
  const mcp = toFormat(parseTools(chat.output).tools, "mcp");
  assert.deepEqual(mcp.output, { name: "get_invoice", description: "Fetch", inputSchema: ok });
  assert.ok(mcp.warnings.some((w) => w.includes("strict")));
  const back = toFormat(parseTools({ name: "x", title: "X", inputSchema: ok, annotations: { readOnlyHint: true } }).tools, "openai-responses");
  assert.deepEqual(back.output, { type: "function", name: "x", parameters: ok });
  assert.equal(back.warnings.length, 2);
  assert.equal(parseTools({ tools: [{ functionDeclarations: [{ name: "g", parameters: ok }] }] }).from, "gemini-legacy");
  assert.deepEqual(parseTools([{ foo: 1 }]).errors, ["Item 1 isn't a recognised tool definition."]);
});
