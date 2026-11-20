// Decision API converter + classifier migrator: every fixture in
// tests/fixtures/decisions/ (PRD §12) and a test per warning code.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { convert, emit, makeWarner, curl } from "../decisions/convert.js";
import { detectFormat, splitLevel } from "../decisions/formats.js";
import { migrate, unwrapSchema } from "../decisions/migrate.js";

const data = JSON.parse(readFileSync(new URL("../../../../data/decision_formats.json", import.meta.url), "utf8"));
const dir = new URL("./fixtures/decisions/", import.meta.url);
const fixtures = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(new URL(f, dir), "utf8")));
const codes = (ws) => [...new Set(ws.map((w) => w.code))].sort();

test("formats are sourced", () => {
  for (const [id, f] of Object.entries(data.formats)) {
    assert.ok(f.sources.length && f.sources.every((s) => s.url.startsWith("https://")), id);
    assert.ok(f.default_model && f.endpoint, id);
  }
  assert.match(data.checked, /^\d{4}-\d{2}-\d{2}$/);
});

test("every pair page has a real example", () => {
  const ids = new Set(fixtures.map((f) => f.id));
  assert.equal(data.pairs.length, 6);
  data.pairs.forEach((p) => { assert.ok(ids.has(p.example), p.id); assert.ok(data.formats[p.from] && data.formats[p.to], p.id); });
});

for (const fx of fixtures) {
  test(`decision fixture ${fx.id}`, () => {
    const e = fx.expect;
    if (fx.mode === "roundtrip") {
      const there = convert(fx.input, null, "gemini", data);
      const back = convert(there.body, "gemini", "openai", data);
      assert.deepEqual({ ...back.body, model: fx.input.model }, fx.input);
      return;
    }
    if (fx.mode === "migrate") {
      if (e.error) { assert.throws(() => migrate(fx.input, fx.options || {}), new RegExp(e.error)); return; }
      const m = migrate(fx.input, fx.options || {});
      assert.deepEqual(m.ir.questions.map((q) => [q.key, q.kind]), e.questions);
      if (e.keep) assert.deepEqual(m.keep, e.keep);
      if (e.dropped) assert.deepEqual(m.dropped.map((d) => [d.field, d.flag]), e.dropped);
      if (e.orderable) assert.deepEqual(m.mapping.filter((r) => r.orderable).map((r) => r.key), e.orderable);
      if (e.flags) for (const [k, fl] of Object.entries(e.flags)) assert.deepEqual(m.mapping.find((r) => r.key === k).flags, fl);
      if (e.levels) for (const [k, ls] of Object.entries(e.levels)) assert.deepEqual(m.ir.questions.find((q) => q.key === k).levels.map((l) => l.label), ls);
      if (e.options) for (const [k, os] of Object.entries(e.options)) assert.deepEqual(m.ir.questions.find((q) => q.key === k).options.map((o) => o.value), os);
      const { warn } = makeWarner(data);
      const body = emit(m.ir, fx.to, data, warn);
      if (e.body) assert.deepEqual(body, e.body);
      return;
    }
    const r = convert(fx.input, fx.from || null, fx.to, data);
    assert.deepEqual(codes(r.warnings), [...e.warnings].sort());
    if (e.body) assert.equal(JSON.stringify(r.body, null, 2), JSON.stringify(e.body, null, 2));
    if (e.question_keys) assert.deepEqual(Object.keys(r.body.questions), e.question_keys);
    if ("input" in e) assert.equal(r.body.input, e.input);
    if (e.message_includes) for (const [c, s] of Object.entries(e.message_includes)) assert.ok(r.warnings.find((w) => w.code === c).message.includes(s));
  });
}

test("every warning code is exercised by a fixture", () => {
  const seen = new Set();
  for (const fx of fixtures.filter((f) => f.mode === "convert")) convert(fx.input, fx.from || null, fx.to, data).warnings.forEach((w) => seen.add(w.code));
  const expected = ["criteria-folded", "option-order", "score-merged", "score-split", "limit-exceeded", "too-few", "key-invalid", "unnamed", "json-stringified", "history-serialized", "media-manual", "box-unsupported", "instructions-parts", "probability-range", "model-reset"];
  expected.forEach((c) => assert.ok(seen.has(c), `no fixture for ${c}`));
});

test("detects formats", () => {
  assert.equal(detectFormat({ questions: [] }), "openai");
  assert.equal(detectFormat({ input: "x", questions: {} }), "gemini");
  assert.equal(detectFormat({ state: "x", questions: {} }), "jev");
  assert.equal(detectFormat({ model: "clef", state: "x", questions: {} }), "clef");
  assert.throws(() => convert({ hello: 1 }, null, "openai", data), /Couldn't tell the format/);
});

test("score-split rule: label before the first ': ' when short, else whole string", () => {
  assert.deepEqual(splitLevel("Low: minor"), { label: "Low", description: "minor", how: "split" });
  const long = "x".repeat(70);
  assert.equal(splitLevel(long).label.length, 60);
  assert.equal(splitLevel(long).description, long);
});

test("output is deterministic", () => {
  const fx = fixtures.find((f) => f.id === "dec-openai-mixed");
  assert.equal(JSON.stringify(convert(fx.input, null, "gemini", data).body), JSON.stringify(convert(fx.input, null, "gemini", data).body));
});

test("curl uses env placeholders only", () => {
  const fx = fixtures.find((f) => f.id === "dec-openai-mixed");
  for (const to of ["openai", "gemini", "jev", "clef"]) {
    const c = curl(convert(fx.input, null, to, data).body, to, data);
    assert.match(c, /\$[A-Z_]+/);
    assert.doesNotMatch(c, /sk-|AIza/);
  }
});

test("unwraps schema wrappers", () => {
  const s = { type: "object", properties: {} };
  assert.equal(unwrapSchema({ type: "json_schema", json_schema: { schema: s } }), s);
  assert.equal(unwrapSchema({ name: "t", input_schema: s }), s);
  assert.equal(unwrapSchema({ name: "t", parameters: s }), s);
  assert.equal(unwrapSchema(s), s);
});
