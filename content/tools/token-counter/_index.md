---
title: "Token Counter"
seo_title: "Token Counter for OpenAI, Claude and Gemini (Free, runs in your browser) | AIEngineerGuide"
h1: "Token counter for OpenAI, Claude and Gemini"
breadcrumb: "Token counter"
app_name: "Token counter"
description: "Free token counter: exact OpenAI counts (o200k_base, cl100k_base), Claude and Gemini estimates, and cost per model. No signup, runs in your browser."
promise: "Paste a prompt and get token counts for OpenAI, Claude and Gemini, plus what it costs on any model."
tool: llm-cost-calculator
related_tool: token-counter
tab: tokens
layout: tool
outputs: ["HTML"]
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste your prompt, document or JSON into the box, or drop a `.txt`, `.md` or `.json` file on it."
  - "Read the count for the tokenizer your model uses. OpenAI counts are exact; Claude and Gemini are labelled estimates."
  - "Pick a model to see the cost of those tokens as input or output and how much of its context window they use."
faq:
  - q: "How accurate is this token counter?"
    a: "OpenAI counts are exact: they use the same `o200k_base` and `cl100k_base` encodings as OpenAI's tiktoken, via the open-source gpt-tokenizer library. Claude and Gemini don't publish browser tokenizers, so those rows are estimates from the providers' own rules of thumb."
  - q: "How many characters is a token?"
    a: "For English text, roughly 4 characters per token on OpenAI and Gemini models, and about 3.5 characters on Claude models before Claude 4.7. Claude 4.7 and later models produce about 30% more tokens for the same text. Code, non-English text and JSON usually use more tokens per character."
  - q: "Is my text uploaded anywhere?"
    a: "No. Counting happens in your browser. The page downloads the tokenizer file from this site once; your text is never sent to a server."
  - q: "How do I get an exact Claude or Gemini token count?"
    a: "Call Anthropic's free [token counting endpoint](https://platform.claude.com/docs/en/build-with-claude/token-counting) (`POST /v1/messages/count_tokens`) or Gemini's [`countTokens`](https://ai.google.dev/gemini-api/docs/tokens) with the model you plan to use."
  - q: "Which OpenAI models use o200k_base?"
    a: "GPT-4o, GPT-4.1, the GPT-5 family and later models, and the o-series reasoning models use `o200k_base`. Older GPT-4, GPT-4 Turbo and GPT-3.5 Turbo models use `cl100k_base`."
---

## How we count tokens

| Tokenizer | Method | Source |
|---|---|---|
| OpenAI `o200k_base`, `cl100k_base` | Exact. Encoded in your browser with [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) 4.1.0 (MIT). | Matches tiktoken test vectors (checked 2026-11-02) |
| Claude before 4.7 | Estimate: characters ÷ 3.5 | Anthropic [glossary](https://platform.claude.com/docs/en/about-claude/glossary): "a token represents approximately 3.5 English characters" (checked 2026-11-02) |
| Claude 4.7 and later | Estimate: characters ÷ 3.5 × 1.3 | Anthropic [token counting docs](https://platform.claude.com/docs/en/build-with-claude/token-counting): "approximately 30 percent more tokens" (checked 2026-11-02) |
| Gemini | Estimate: characters ÷ 4 | Google [Gemini tokens guide](https://ai.google.dev/gemini-api/docs/tokens): "a token is equivalent to about 4 characters" (checked 2026-11-02) |

Estimates are for English prose. They undercount code, JSON and most non-English languages, so leave headroom. Costs use prices from [models.dev](https://models.dev) (checked {{< tools-models-checked >}}), cross-checked against official pricing pages; message formatting, tool definitions and images add tokens that this counter doesn't see.
