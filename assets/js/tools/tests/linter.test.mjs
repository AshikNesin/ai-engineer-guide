// Every rule in data/breaking_changes.json has a before/after example:
// `before` must trigger the rule, `after` must not, and (unless the rule is
// marked manual) applying the fix to `before` must produce `after`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lint, applyFixes, CHECKS, targetMatches, readsFirstBlock } from "../linter/core.js";
import { parseInput, detectApiFromBody } from "../linter/parse.js";

const data = JSON.parse(readFileSync(new URL("../../../../data/breaking_changes.json", import.meta.url), "utf8"));

test("every rule is well formed", () => {
  const ids = new Set();
  for (const r of data.rules) {
    assert.ok(!ids.has(r.id), `duplicate id ${r.id}`);
    ids.add(r.id);
    assert.match(r.id, /^[a-z0-9-]+$/);
    assert.ok(CHECKS[r.check], `${r.id}: unknown check ${r.check}`);
    assert.ok(r.sources.length && r.sources.every((s) => s.url.startsWith("https://") && s.quote), `${r.id}: needs a sourced quote`);
    assert.match(r.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(["400", "error", "maybe", "behavior"].includes(r.status), `${r.id}: status`);
    assert.ok(r.example?.before && r.example?.after, `${r.id}: example`);
  }
});

for (const rule of data.rules) {
  test(`rule ${rule.id}: before triggers, after passes`, () => {
    const ex = rule.example;
    const api = detectApiFromBody(ex.before) || rule.apis[0];
    const opts = { rules: data.rules, target: ex.target, api, apiVersion: ex.api_version || "2023-06-01" };
    const before = lint(ex.before, opts).map((f) => f.rule.id);
    assert.ok(before.includes(rule.id), `${rule.id} not triggered by before (got ${before})`);
    const after = lint(ex.after, opts).map((f) => f.rule.id);
    assert.ok(!after.includes(rule.id), `${rule.id} still triggered by after`);
    if (!ex.manual) {
      const findings = lint(ex.before, opts).filter((f) => f.rule.id === rule.id);
      assert.deepEqual(applyFixes(ex.before, findings, { target: ex.target, api }), ex.after);
    }
  });
}

test("target patterns", () => {
  assert.ok(targetMatches("gpt-6*", "gpt-6.1-sol"));
  assert.ok(targetMatches("claude-*", "claude-opus-4-8"));
  assert.ok(!targetMatches("o3", "o3-pro"));
});

test("API version rules only apply to 2026-10-21", () => {
  const body = { model: "claude-opus-4-8", max_tokens: 10, temperature: 1, messages: [{ role: "user", content: "hi" }] };
  const ids = (v) => lint(body, { rules: data.rules, target: "claude-opus-4-8", api: "messages", apiVersion: v }).map((f) => f.rule.id);
  assert.deepEqual(ids("2023-06-01"), []);
  assert.deepEqual(ids("2026-10-21"), ["anthropic-api-2026-10-21-sampling-parameters"]);
});

test("parses a Python SDK call", () => {
  const src = `response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    temperature=0,  # deterministic
    messages=[{"role": "user", "content": 'It\\'s "quoted"'}],
    tool_choice={"type": "any"},
    stream=False,
)
print(response.content[0].text)`;
  const { body, api, raw } = parseInput(src);
  assert.equal(api, "messages");
  assert.equal(body.temperature, 0);
  assert.equal(body.stream, false);
  assert.equal(body.messages[0].content, `It's "quoted"`);
  assert.ok(readsFirstBlock(raw));
  const ids = lint(body, { rules: data.rules, target: "claude-sonnet-5-5", api }).map((f) => f.rule.id);
  assert.ok(ids.includes("claude-sonnet-5-5-sampling-parameters"));
  assert.ok(ids.includes("claude-sonnet-5-5-forced-tool-choice"));
});

test("parses a TypeScript SDK call", () => {
  const src = `const r = await openai.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [{ role: 'user', content: 'hi' }],
    max_tokens: 200,
    tools: [{ type: 'function', function: { name: 'f', parameters: { type: 'object', properties: {} } } }],
  });`;
  const { body, api } = parseInput(src);
  assert.equal(api, "chat");
  assert.equal(body.max_tokens, 200);
  const ids = lint(body, { rules: data.rules, target: "gpt-6-astra", api }).map((f) => f.rule.id);
  assert.deepEqual(ids, ["openai-gpt-6-chat-tools-require-responses"]);
});

test("variables in a snippet give a clear error", () => {
  assert.throws(() => parseInput("client.messages.create(model=MODEL, max_tokens=10, messages=msgs)"), /variable/);
});

test("JSON body detection", () => {
  assert.equal(parseInput('{"model":"gpt-5","input":"hi"}').api, "responses");
  assert.equal(parseInput('{"model":"claude-opus-4-8","max_tokens":5,"messages":[]}').api, "messages");
  assert.equal(parseInput('{"model":"o3","messages":[]}').api, "chat");
});
