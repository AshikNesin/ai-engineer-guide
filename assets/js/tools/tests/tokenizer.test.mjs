// Checks the vendored gpt-tokenizer files against known test vectors and the
// pre-computed sample counts baked into layouts/partials/tools/ui/panel-tokens.html.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const o200k = await import("../../../vendor/gpt-tokenizer-o200k_base.mjs");
const cl100k = await import("../../../vendor/gpt-tokenizer-cl100k_base.mjs");

test("known vectors", () => {
  // Same IDs tiktoken returns for "hello world".
  assert.deepEqual(o200k.encode("hello world"), [24912, 2375]);
  assert.deepEqual(cl100k.encode("hello world"), [15339, 1917]);
  assert.equal(o200k.decode(o200k.encode("héllo 👋 世界")), "héllo 👋 世界");
  assert.equal(cl100k.countTokens(""), 0);
});

test("sample counts in the template are correct", () => {
  const tpl = readFileSync(new URL("../../../../layouts/partials/tools/ui/panel-tokens.html", import.meta.url), "utf8");
  const sample = readFileSync(new URL("../../../tools/token-counter-sample.txt", import.meta.url), "utf8");
  const counts = tpl.match(/"o200k_base" (\d+) "cl100k_base" (\d+)/);
  assert.equal(o200k.countTokens(sample), Number(counts[1]));
  assert.equal(cl100k.countTokens(sample), Number(counts[2]));
});
