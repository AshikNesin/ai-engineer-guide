// Reasoning prefix checker: data validation, every fixture in
// tests/fixtures/reasoning/ (PRD §12), and the model-switch matrix.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { compare, verdict, switchHandOff, chooseFix } from "../reasoning/verdict.js";
import { switchCheck, anthropicReads } from "../reasoning/switch.js";
import { readPaste, decodeEntries, summaryLine, recognizeError } from "../reasoning/decode.js";
import { errorPathToSentIndex } from "../reasoning/anthropic.js";
import { modelInfo } from "../reasoning/openai.js";
import { canon, wordDiff, jsonErrorPosition } from "../reasoning/canon.js";
import { parseRequest, parseLog, detectApi } from "../reasoning/detect.js";
import { markdownReport } from "../reasoning/report.js";

const rules = JSON.parse(readFileSync(new URL("../../../../data/reasoning_rules.json", import.meta.url), "utf8"));
const dir = new URL("./fixtures/reasoning/", import.meta.url);
const fixtures = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(new URL(f, dir), "utf8")));
const ISO = /^\d{4}-\d{2}-\d{2}$/;

// ---- Data validation -------------------------------------------------------
const hasSource = (s) => (s.url ? s.url.startsWith("https://") : !!rules.sources[s.ref]) && typeof s.quote === "string" && s.quote.length > 0;

test("sources map has https URLs", () => {
  for (const [id, s] of Object.entries(rules.sources)) assert.ok(s.url.startsWith("https://"), id);
});

test("ids are unique and slug-safe", () => {
  for (const list of ["fixes", "reasons", "errors", "change_kinds"]) {
    const ids = rules[list].map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, `${list}: duplicate id`);
    ids.forEach((id) => assert.match(id, /^[a-z0-9-]+$/, `${list}: ${id}`));
  }
});

test("every model, fix, reason and error is sourced and dated", () => {
  const all = [...rules.anthropic.models, ...rules.openai.models, ...rules.fixes, ...rules.reasons, ...rules.errors, ...rules.error_lookalikes];
  for (const x of all) {
    assert.ok(x.sources && x.sources.length, `${x.id}: needs sources`);
    x.sources.forEach((s) => assert.ok(hasSource(s), `${x.id}: bad source ${JSON.stringify(s)}`));
  }
  for (const x of [...rules.fixes, ...rules.reasons, ...rules.errors]) assert.match(x.checked, ISO, x.id);
  assert.match(rules.checked, ISO);
  Object.values(rules.anthropic.caveats).forEach((s) => assert.ok(hasSource(s)));
  Object.values(rules.openai.caveats).forEach((s) => assert.ok(hasSource(s)));
});

test("every fix reference resolves and every reads group exists", () => {
  const fixIds = new Set(rules.fixes.map((f) => f.id));
  const ref = (id, where) => assert.ok(id === null || id === undefined || fixIds.has(id), `${where}: unknown fix ${id}`);
  rules.change_kinds.forEach((k) => ref(k.fix, k.id));
  rules.reasons.forEach((r) => ref(r.fix, r.id));
  rules.errors.forEach((e) => { ref(e.fix, e.id); ref(e.long_term_fix, e.id); (e.also || []).forEach((a) => ref(a, e.id)); });
  rules.fixes.forEach((f) => (f.also || []).forEach((a) => ref(a, f.id)));
  rules.openai.prefix_params.forEach((p) => ref(p.fix, p.param));
  const groups = new Set(rules.anthropic.groups.map((g) => g.id));
  for (const [to, froms] of Object.entries(rules.anthropic.reads)) {
    if (to === "_comment") continue;
    assert.ok(groups.has(to), to);
    froms.forEach((f) => assert.ok(groups.has(f), `${to} <- ${f}`));
  }
  rules.anthropic.models.forEach((m) => assert.ok(groups.has(m.group), m.id));
});

test("reason and error examples point at real fixtures", () => {
  const ids = new Set(fixtures.map((f) => f.id));
  for (const x of [...rules.reasons, ...rules.errors]) if (x.example && x.example.fixture) assert.ok(ids.has(x.example.fixture), `${x.id}: ${x.example.fixture}`);
  for (const x of [...rules.examples, ...rules.decode_examples]) assert.ok(ids.has(x.id), x.id);
});

test("PRD counts: 9 reasons, 4 errors", () => {
  assert.equal(rules.reasons.length, 9);
  assert.equal(rules.errors.length, 4);
});

test("unconfirmed model ids are flagged", () => {
  const preview = rules.anthropic.models.find((m) => m.id === "claude-mythos-preview");
  assert.equal(preview.id_verified, false);
});

// ---- Tab 1 fixtures ----------------------------------------------------------
for (const fx of fixtures.filter((f) => f.a && f.b)) {
  test(`prefix fixture ${fx.id}`, () => {
    const opts = { batch: !!(fx.options && fx.options.batch) };
    const r = compare(fx.a, fx.b, opts, rules);
    const e = fx.expect;
    if (e.status) assert.equal(r.status, e.status);
    if ("first_change" in e) {
      if (e.first_change === null) assert.equal(r.firstChange, null, `unexpected change ${JSON.stringify(r.firstChange)}`);
      else {
        assert.ok(r.firstChange, "expected a change");
        assert.equal(r.firstChange.kind, e.first_change.kind);
        if (e.first_change.path_b) assert.equal(r.firstChange.pathB, e.first_change.path_b);
      }
    }
    if (e.invalid_paths) assert.deepEqual(r.invalidPaths, e.invalid_paths);
    if (e.verdicts) {
      const v = verdict(r, rules, Object.keys(e.verdicts));
      const got = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x.outcome]));
      assert.deepEqual(got, e.verdicts);
      if (e.reasons) for (const [k, rs] of Object.entries(e.reasons)) assert.deepEqual(v[k].reasons, rs);
      if (e.info) for (const [k, i] of Object.entries(e.info)) assert.equal(v[k].info, i);
    }
    if (e.fix) assert.equal(chooseFix(r, rules)?.id, e.fix);
    if (e.switch) {
      const s = switchHandOff(r, rules);
      assert.deepEqual({ from: s.from, to: s.to, result: s.result }, e.switch);
    }
    if (e.not_compared) e.not_compared.forEach((f) => assert.ok(r.notCompared.some((n) => n.field === f), `not compared: ${f}`));
    if (e.notes) e.notes.forEach((id) => assert.ok(r.notes.some((n) => n.id === id), `note ${id}`));
  });
}

test("report renders for every prefix fixture", () => {
  for (const fx of fixtures.filter((f) => f.a && f.b && f.api !== "chat")) {
    const r = compare(fx.a, fx.b, {}, rules);
    const md = markdownReport({ result: r, verdicts: verdict(r, rules), fix: chooseFix(r, rules), rules });
    assert.match(md, /^# Reasoning prefix check/);
  }
});

test("mixed APIs are refused", () => {
  const r = compare({ model: "claude-fable-5-2", messages: [] }, { model: "gpt-6.2-astra", input: "hi" }, {}, rules);
  assert.equal(r.status, "mixed-apis");
});

test("Gemini and decision bodies are recognized", () => {
  assert.equal(detectApi({ contents: [] }), "gemini");
  assert.equal(detectApi({ model: "gpt-6-luna", input: "x", questions: [] }), "decision");
});

// ---- Tab 2: the docs' switch table, transcribed (rows from, columns to) ----
const DOCS_TABLE = {
  "haiku-5-5":        ["✅", "—", "✅", "✅", "✅"],
  "sonnet-5-5":       ["✅", "—", "✅", "✅", "—"],
  "opus-5":           ["✅", "✅", "✅", "—", "—"],
  "opus-5-5":         ["✅", "✅", "✅", "—", "—"],
  "fable-mythos-5":   ["✅", "✅", "—", "—", "—"],
  "fable-mythos-5-1": ["✅", "✅", "—", "—", "—"],
  "fable-mythos-5-2": ["✅", "—", "—", "—", "—"],
};
const COLS = ["fable-mythos-5-2", "fable-mythos-5-1", "opus-5-5", "sonnet-5-5", "haiku-5-5"];
for (const [from, cells] of Object.entries(DOCS_TABLE)) {
  cells.forEach((cell, i) => {
    test(`switch matrix: ${from} -> ${COLS[i]} = ${cell}`, () => {
      assert.equal(anthropicReads(from, COLS[i], rules), cell === "✅");
    });
  });
}

const sw = (from, to, opts = {}) => switchCheck([from], to, opts, rules).rows[0];
test("switch: Fable 5.2 -> Opus 5.5 dropped", () => assert.equal(sw("claude-fable-5-2", "claude-opus-5-5").result, "dropped"));
test("switch: Opus 4.8 -> Haiku 5.5 read", () => assert.equal(sw("claude-opus-4-8", "claude-haiku-5-5").result, "reads"));
test("switch: Opus 5 -> Fable 5 read", () => assert.equal(sw("claude-opus-5", "claude-fable-5").result, "reads"));
test("switch: GPT-5.6 Sol -> Luna depends", () => assert.equal(sw("gpt-5.6-sol", "gpt-5.6-luna").result, "depends"));
test("switch: GPT-6.1 Sol -> GPT-6.2 Astra dropped", () => {
  const r = sw("gpt-6.1-sol", "gpt-6.2-astra");
  assert.equal(r.result, "dropped");
  assert.equal(r.reason, "model_mismatch");
});
test("switch: Sonnet 5.5 -> GPT-6.2 Astra dropped (provider)", () => assert.equal(sw("claude-sonnet-5-5", "gpt-6.2-astra").reason, "different-provider"));
test("switch: account change drops Haiku 5.5 blocks", () => {
  const r = sw("claude-haiku-5-5", "claude-opus-5-5", { accountSwitch: true });
  assert.equal(r.result, "dropped");
  assert.equal(r.reason, "organization_binding_mismatch");
});
test("switch: Bedrock, Opus 5.5 -> Fable 5.2 unknown", () => assert.equal(sw("claude-opus-5-5", "claude-fable-5-2", { platform: "bedrock" }).result, "unknown"));
test("switch: Google-managed, Opus 5.5 -> Fable 5.2 read", () => assert.equal(sw("claude-opus-5-5", "claude-fable-5-2", { platform: "gcp-google-managed" }).result, "reads"));
test("switch: Bedrock, Fable 5.2 -> Opus 5.5 dropped", () => assert.equal(sw("claude-fable-5-2", "claude-opus-5-5", { platform: "bedrock" }).result, "dropped"));
test("switch: unknown pair is unknown", () => assert.equal(sw("claude-mythos-preview", "claude-opus-5-5").result, "unknown"));
test("switch: dated earlier id is earlier", () => assert.equal(sw("claude-sonnet-4-5-20250929", "claude-fable-5-2").result, "reads"));
test("switch: refusal fallback drops", () => assert.equal(sw("claude-fable-5-1", "claude-opus-5-5", { refusalFallback: true }).reason, "refusal-fallback"));
test("switch caveats: preserved target warns about thinking.enabled", () => {
  assert.ok(switchCheck(["claude-opus-5"], "claude-fable-5-2", {}, rules).caveats.includes("thinking-adaptive"));
  assert.ok(switchCheck(["claude-opus-5-5"], "claude-sonnet-5", {}, rules).caveats.includes("system-messages"));
});

// ---- Tab 3 ------------------------------------------------------------------
for (const fx of fixtures.filter((f) => "input" in f)) {
  test(`decode fixture ${fx.id}`, () => {
    const text = typeof fx.input === "string" ? fx.input : JSON.stringify(fx.input);
    const paste = readPaste(text);
    const e = fx.expect;
    if (e.error) {
      assert.equal(paste.kind, "error");
      const r = recognizeError(paste.error, rules, fx.request);
      assert.equal(r.match && r.match.id, e.error);
      if (e.path) assert.equal(r.path, e.path);
      if (e.mapped) { assert.equal(r.mapped.path, e.mapped); assert.equal(r.mapped.same, false); }
      return;
    }
    const d = decodeEntries(paste, rules, fx.request);
    assert.deepEqual(d.rows.map((r) => (r.reason ? r.reason.id : null)), e.reasons);
    assert.deepEqual(d.counts, e.counts);
    if (e.summary) assert.equal(summaryLine(d.counts), e.summary);
    if (e.source) assert.equal(d.source, e.source);
    if (e.billed) assert.equal(d.rows[0].reason.billed, true);
    if (e.resolved) assert.deepEqual(d.rows.map((r) => r.resolved.path), e.resolved);
  });
}

test("bound error with the header sentence also flags the header", () => {
  const msg = "messages.1.content.0: Invalid `signature` in `thinking` block. The block is bound to a different conversation. Remove the block, or set `thinking.block_binding.prefix_mismatch_behavior` to \"drop_block\". That setting requires the `thinking-binding-controls-2026-08-01` value in the `anthropic-beta` header.";
  const r = recognizeError({ message: msg }, rules);
  assert.equal(r.match.id, "thinking-block-bound-to-a-different-conversation");
  assert.deepEqual(r.also.map((x) => x.id), ["thinking-binding-controls-beta-header-required"]);
});

test("temperature errors point at the linter", () => {
  assert.equal(recognizeError({ message: "`temperature` may only be set to 1 when thinking is enabled." }, rules).match.id, "temperature-or-prefill");
});

test("error path mapping: same-role messages merge", () => {
  const msgs = [{ role: "user", content: "a" }, { role: "user", content: "b" }, { role: "assistant", content: [{ type: "thinking", thinking: "", signature: "s" }] }];
  assert.equal(errorPathToSentIndex(msgs, "messages.1.content.0").path, "messages.2.content.0");
  assert.equal(errorPathToSentIndex(msgs, "messages.0.content.1").path, "messages.1.content.0");
});

// ---- Helpers ----------------------------------------------------------------
test("canon sorts keys and drops cache_control", () => {
  assert.equal(canon({ b: 1, a: { cache_control: { type: "ephemeral" }, z: 2 } }), '{"a":{"z":2},"b":1}');
});
test("wordDiff marks the changed word", () => {
  assert.deepEqual(wordDiff("Today is 2026-11-18.", "Today is 2026-11-19."), [{ op: "eq", text: "Today is " }, { op: "del", text: "2026-11-18." }, { op: "ins", text: "2026-11-19." }]);
});
test("JSON errors map to line and column", () => {
  const text = '{\n  "a": 1,\n  }';
  let err;
  try { JSON.parse(text); } catch (x) { err = x; }
  const p = jsonErrorPosition(text, err);
  assert.equal(p.line, 3);
  assert.match(p.message, /^Line 3, column \d+: /);
});
test("parseRequest reads a Python SDK call", () => {
  const r = parseRequest('client.messages.create(model="claude-fable-5-2", max_tokens=10, messages=[{"role": "user", "content": "hi"}])');
  assert.equal(r.api, "anthropic");
});
test("parseRequest reports variables", () => {
  assert.throws(() => parseRequest("client.messages.create(model=MODEL, messages=msgs)"), /debug logging/);
});
test("parseLog reads JSONL and arrays", () => {
  assert.equal(parseLog('{"a":1}\n{"a":2}\n').length, 2);
  assert.equal(parseLog('[{"a":1},{"a":2},{"a":3}]').length, 3);
  assert.throws(() => parseLog('{"a":1}\n{"a":'), /Line 2:/);
});

// Review fixes (PR #20)
test("gpt-5.12 is not treated as GPT-6.2 or later", () => {
  assert.equal(modelInfo("gpt-5.12-mini", rules).prefix_drop, false);
  assert.equal(modelInfo("gpt-6.10-mini", rules).prefix_drop, true);
});
test("JSONL rejects non-object lines and keeps line numbers with leading blanks", () => {
  assert.throws(() => parseLog('{"a":1}\nnull'), /Line 2:/);
  assert.throws(() => parseLog('\n\n{"a":1}\n{bad'), /Line 4:/);
});
test("decoder ignores null and non-array entries", () => {
  assert.deepEqual(readPaste("[null]").entries, []);
  assert.deepEqual(readPaste('{"object":"response","output":[],"input_transformations":{}}').entries, []);
});
