// Token estimates for tokenizers we can't run in the browser.
// Every ratio here comes from official docs (see the token counter page).

// Anthropic glossary: on models before Claude 4.7 "a token represents
// approximately 3.5 English characters".
export const CLAUDE_LEGACY_CHARS_PER_TOKEN = 3.5;
// Anthropic token counting docs: Claude 4.7+ "produces approximately 30 percent
// more tokens for the same text than earlier models".
export const CLAUDE_NEW_MULTIPLIER = 1.3;
// Google Gemini docs: "a token is equivalent to about 4 characters".
export const GEMINI_CHARS_PER_TOKEN = 4;
// Generic fallback for other providers (same rule of thumb as Gemini).
export const GENERIC_CHARS_PER_TOKEN = 4;

// Count user-perceived characters (code points), not UTF-16 units.
export function charCount(text) {
  let n = 0;
  for (const _ of text) n += 1;
  return n;
}

export function wordCount(text) {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export function estimate(kind, text) {
  const chars = charCount(text);
  if (chars === 0) return 0;
  switch (kind) {
    case "claude-legacy":
      return Math.ceil(chars / CLAUDE_LEGACY_CHARS_PER_TOKEN);
    case "claude-new":
      return Math.ceil((chars / CLAUDE_LEGACY_CHARS_PER_TOKEN) * CLAUDE_NEW_MULTIPLIER);
    case "gemini":
      return Math.ceil(chars / GEMINI_CHARS_PER_TOKEN);
    default:
      return Math.ceil(chars / GENERIC_CHARS_PER_TOKEN);
  }
}
