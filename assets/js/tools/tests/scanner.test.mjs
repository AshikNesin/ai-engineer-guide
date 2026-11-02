// The scanner must find every retiring or retired ID in real-looking files.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildIndex, scan, summarize, checklist, normalize } from "../scanner/core.js";

const data = JSON.parse(readFileSync(new URL("../../../../data/retirements.json", import.meta.url), "utf8"));
const index = buildIndex(data.models);
const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const ids = (text) => [...new Set(scan(text, index).map((h) => h.id))].sort();
const TODAY = new Date(2026, 10, 2);

test("normalizes platform spellings", () => {
  assert.equal(normalize("anthropic.claude-3-5-sonnet-20240620-v1:0"), "claude-3-5-sonnet-20240620");
  assert.equal(normalize("us.anthropic.claude-sonnet-4-5-20250929-v1:0"), "claude-sonnet-4-5-20250929");
  assert.equal(normalize("claude-sonnet-4-5@20250929"), "claude-sonnet-4-5-20250929");
  assert.equal(normalize("models/gemini-2.0-flash"), "gemini-2.0-flash");
  assert.equal(normalize("openai/gpt-4o"), "gpt-4o");
});

test("n8n workflow export", () => {
  assert.deepEqual(ids(fixture("n8n-workflow.json")), ["claude-sonnet-4-5-20250929", "gemini-2.0-flash", "gpt-4o-2024-08-06"]);
});

test("Python file", () => {
  // claude-haiku-4-5 is active (not sooner than date only), so it isn't flagged.
  assert.deepEqual(ids(fixture("app.py")), ["claude-3-5-sonnet-20240620", "claude-sonnet-4-5", "claude-sonnet-4-5-20250929", "o3"]);
  const alias = scan(fixture("app.py"), index).find((h) => h.id === "claude-sonnet-4-5");
  assert.equal(alias.match, "alias");
  assert.equal(alias.model.slug, "claude-sonnet-4-5");
});

test("TypeScript file", () => {
  assert.deepEqual(ids(fixture("client.ts")), ["claude-sonnet-4-5-20250929", "gpt-4.1-mini-2025-04-14", "gpt-4o", "gpt-4o-mini", "gpt-5", "tts-1-hd"]);
  // gpt-4o alias resolves to the upcoming Jan 2027 shutdown, not the retired 2024-05-13 snapshot.
  const g = scan(fixture("client.ts"), index).find((h) => h.id === "gpt-4o");
  assert.equal(g.model.shutdown, "2027-01-14");
});

test("summary ordering and checklist", () => {
  const rows = summarize(scan(fixture("app.py"), index), TODAY);
  assert.equal(rows[0].id, "claude-3-5-sonnet-20240620"); // retired first
  assert.ok(rows[0].retired);
  const sonnet = rows.find((r) => r.id === "claude-sonnet-4-5-20250929");
  assert.equal(sonnet.days, 28);
  assert.match(checklist(rows), /- \[ \] `o3` \(shuts down 2026-12-11\), replace with gpt-5.6-sol/);
});

test("no false positives on look-alikes", () => {
  assert.deepEqual(ids("gpt-4o-mini-2024-07-18x gpt-6-luna claude-opus-4-8 o3x"), []);
});
