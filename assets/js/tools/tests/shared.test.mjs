// Browser-free unit tests for the tools' shared JS. Run locally:
//   node --test assets/js/tools/tests/
// Node isn't needed for the Cloudflare build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { estimate, charCount, wordCount } from "../shared/estimate.js";
import { requestCost, monthlyCost, cachingCost } from "../shared/cost.js";
import { fmtMoney, fmtTokens, daysUntil } from "../shared/format.js";
import { escapeText, fold, singleEventIcs } from "../shared/ics.js";

test("estimates use the documented ratios", () => {
  const text = "a".repeat(350);
  assert.equal(estimate("claude-legacy", text), 100);
  assert.equal(estimate("claude-new", text), 130);
  assert.equal(estimate("gemini", "a".repeat(400)), 100);
  assert.equal(estimate("gemini", ""), 0);
  assert.equal(charCount("héllo👋"), 6);
  assert.equal(wordCount("  hello   world \n x "), 3);
});

test("request and monthly cost", () => {
  const price = { input: 2, output: 10, cache_read: 0.1 };
  // 1M input, 100K output, no cache: $2 + $1
  assert.equal(requestCost(price, { input: 1e6, output: 1e5 }), 3);
  // half cached: 0.5M*2 + 0.5M*0.1 + 0.1M*10 = 1 + 0.05 + 1
  assert.ok(Math.abs(requestCost(price, { input: 1e6, output: 1e5, cachedShare: 0.5 }) - 2.05) < 1e-9);
  assert.equal(requestCost(price, { input: 1e6, output: 1e5, batch: true, provider: "openai" }), 1.5);
  assert.equal(requestCost(price, { input: 1e6, output: 1e5, batch: true, provider: "xai" }), null);
  assert.equal(monthlyCost(0.01, 1000), 300);
  assert.equal(requestCost({ input: null, output: 1 }, { input: 1, output: 1 }), null);
});

test("prompt caching break-even (Anthropic 5-minute cache: 1.25x write, 0.1x read)", () => {
  const r = cachingCost({ input: 3, cache_read: 0.3, cache_write: 3.75 }, { prefix: 1e6, reads: 9 });
  assert.equal(r.breakEven, 1);
  assert.ok(Math.abs(r.without - 30) < 1e-9);
  assert.ok(Math.abs(r.withCache - (3.75 + 9 * 0.3)) < 1e-9);
  const hour = cachingCost({ input: 3, cache_read: 0.3 }, { prefix: 1e6, reads: 1, writeMultiplier: 2 });
  assert.equal(hour.breakEven, 2);
  // Automatic caching (no write premium) pays off from the first read.
  assert.equal(cachingCost({ input: 2.5, cache_read: 1.25 }, { prefix: 1000, reads: 1 }).breakEven, 0);
});

test("formatting", () => {
  assert.equal(fmtMoney(1234.5), "$1,235");
  assert.equal(fmtMoney(12.345), "$12.35");
  assert.equal(fmtMoney(0.0123), "$0.012");
  assert.equal(fmtMoney(0.0000028), "<$0.00001");
  assert.equal(fmtTokens(1_000_000), "1M");
  assert.equal(fmtTokens(128_000), "128K");
  assert.equal(fmtTokens(1_048_576), "1.05M");
  assert.equal(daysUntil("2026-11-30", new Date(2026, 10, 2)), 28);
  assert.equal(daysUntil("2026-11-01", new Date(2026, 10, 2)), -1);
});

test("ics helpers", () => {
  assert.equal(escapeText("a,b;c\\d\ne"), "a\\,b\;c\\\\d\\ne");
  const folded = fold("X".repeat(200));
  for (const line of folded.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75);
  const ics = singleEventIcs({
    uid: "o3-2026-12-11@aiengineerguide.com", sequence: 1, date: "2026-12-31",
    title: "o3 shuts down", description: "Replacement: gpt-5.6-sol", url: "https://x/",
    now: new Date("2026-11-02T00:00:00Z"),
  });
  assert.match(ics, /DTSTART;VALUE=DATE:20261231\r\n/);
  assert.match(ics, /DTEND;VALUE=DATE:20270101\r\n/);
  assert.match(ics, /SEQUENCE:1\r\n/);
  assert.match(ics, /TRIGGER:-P30D\r\n/);
  assert.match(ics, /DTSTAMP:20261102T000000Z\r\n/);
});
