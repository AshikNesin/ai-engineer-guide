// Pure helpers for the old -> new model diff tab (unit-tested).
import { CLAUDE_NEW_MULTIPLIER } from "./estimate.js";

/**
 * How many tokens the same text becomes on the new model, relative to the old.
 * Only the Claude tokenizer change is documented (Claude 4.7+ produces about
 * 30% more tokens). Across providers we can't know, so we return 1 and flag it.
 */
export function tokenFactor(oldTok, newTok) {
  if (oldTok === newTok) return { factor: 1, known: true };
  if (oldTok === "claude-legacy" && newTok === "claude-new") return { factor: CLAUDE_NEW_MULTIPLIER, known: true };
  if (oldTok === "claude-new" && newTok === "claude-legacy") return { factor: 1 / CLAUDE_NEW_MULTIPLIER, known: true };
  const openai = new Set(["o200k_base", "cl100k_base"]);
  if (openai.has(oldTok) && openai.has(newTok)) return { factor: 1, known: false };
  return { factor: 1, known: false };
}

export function pctChange(a, b) {
  if (a == null || b == null || a === 0) return null;
  return (b - a) / a;
}
