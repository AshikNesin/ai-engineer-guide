---
title: "LLM API Cost Calculator"
seo_title: "LLM API Cost Calculator: OpenAI, Claude, Gemini Pricing (Free, runs in your browser) | AIEngineerGuide"
h1: "LLM API cost calculator"
breadcrumb: "LLM cost calculator"
app_name: "LLM API cost calculator"
description: "Free LLM API cost calculator: compare OpenAI, Claude and Gemini pricing, count tokens, check context fit and caching break-even. No signup needed."
promise: "Compare the monthly API cost of every major model, then check token counts, context fit, prompt caching and what a model migration does to your bill."
tool: llm-cost-calculator
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Enter your average input and output tokens per request and your requests per day. If you don't know your token counts, paste a real prompt into the **Token count** tab."
  - "Set the share of input served from the prompt cache, tick **Batch API** if the work can wait, and pin up to 4 models to compare."
  - "If you're replacing a retiring model, open **Old vs new model** to see how price, limits and token counts change, then copy the share link for your team."
faq:
  - q: "How is the monthly cost calculated?"
    a: "Per request: uncached input × input price + cached input × cache read price + output × output price, all per million tokens. The monthly cost is that × requests per day × 30. With Batch API ticked, we halve it for providers whose pricing pages list a 50% batch discount (OpenAI, Anthropic, Google and Mistral)."
  - q: "How many tokens is my prompt?"
    a: "Paste it into the Token count tab. OpenAI counts are exact (`o200k_base` and `cl100k_base`); Claude and Gemini counts are estimates using the providers' published characters-per-token guidance."
  - q: "Which LLM has the largest context window?"
    a: "Open the Context fit tab and sort by context window. Several OpenAI, Anthropic, Google, xAI, DeepSeek and Mistral models accept around 1 million tokens; check max input and max output too, since some providers cap input below the full window."
  - q: "Is prompt caching worth it?"
    a: "Usually, if the same prefix is reused within the cache lifetime. On Anthropic's 5-minute cache a write costs 1.25x input and a hit 0.1x, so it pays off after one hit. The Prompt caching tab shows the break-even for any model."
  - q: "Will moving to Claude Sonnet 5.5 cost more than Sonnet 4.5?"
    a: "Per token it's cheaper ($2/$10 vs $3/$15 per million input/output tokens), but Anthropic says the newer tokenizer produces about 30% more tokens for the same text. The Old vs new model tab applies that adjustment."
  - q: "Why is my real bill different?"
    a: "Common reasons: long-context pricing tiers (for example OpenAI prices prompts over 272K tokens at 2x input), reasoning tokens billed as output, tool definitions and images adding input tokens, regional or priority surcharges, and promotional prices that end."
---

## How we calculate this

**Cost per request** = (uncached input × input price + cached input × cache read price + output × output price) ÷ 1,000,000, with prices in USD per million tokens. **Monthly cost** = cost per request × requests per day × 30. The Batch API option halves the result for providers that list a 50% batch discount. The Prompt caching tab compares writing a prefix once and reading it *n* times against sending it uncached *n* + 1 times; break-even is the smallest *n* where caching is cheaper.

Prices come from [models.dev](https://models.dev) (MIT), last data update {{< tools-models-checked >}}. On 2026-11-02 we checked 29 models against the official pages: all 17 Anthropic models matched exactly, as did gpt-5.6-sol/terra/luna, gpt-6-luna, gpt-4o, gpt-4.1, gemini-3.8-flash, gemini-3.5-flash-lite, gemini-3.1-pro-preview, grok-4.7 and deepseek-v4-pro.

### Token count and context fit

OpenAI counts are exact, computed in your browser with [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) 4.1.0 (MIT). Claude and Gemini counts are estimates: characters ÷ 3.5 for Claude before 4.7 ([Anthropic glossary](https://platform.claude.com/docs/en/about-claude/glossary)), × 1.3 for Claude 4.7 and later ([Anthropic token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)), and characters ÷ 4 for Gemini ([Google](https://ai.google.dev/gemini-api/docs/tokens)), all checked 2026-11-02. The provider-specific [token counter pages](/tools/token-counter/) explain each method.

A prompt fits when its input is within the model's max input (or the context window when there's no separate cap), and input plus reserved output stays within the window, with the reserved output no larger than the model's max output.

### Old vs new model

This tab compares list prices, limits and the cost of the same traffic on two models. When you move from a Claude model before 4.7 to Claude 4.7 or later, it scales token counts by 1.3x, per Anthropic's token counting docs. Providers don't publish how their tokenizers compare with each other's, so for a switch between providers, recount a real prompt in the Token count tab.

### Things this calculator doesn't model

- Long-context prices. OpenAI says "Prompts with >272K input tokens are priced at 2x input and 1.5x output for the full request." Gemini 3.1 Pro charges more above 200K-token prompts and Claude Haiku 5.5 above 100K. The table uses the standard tier.
- Promotional prices. OpenAI lists gpt-5.6-sol's current price "at least through November 21, 2026". Google lists gemini-3.8-flash at this price "through December 31, 2026", rising to $1.50 / $7.50 per million input/output tokens on January 1, 2027.
- DeepSeek peak hours. The DeepSeek prices shown are off-peak rates. From 01:00 to 04:00 and 06:00 to 10:00 UTC on weekdays, DeepSeek charges double.
- Surcharges for priority or fast modes, regional or data-residency endpoints (for example a 1.1x multiplier for Anthropic US-only inference), and Gemini's hourly cache storage.
- `mistral-large-latest` points to Mistral Large 3, which Mistral deprecated on October 31, 2026 in favor of Mistral Large 4.

### Official pricing pages

- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) and [Batch API guide](https://developers.openai.com/api/docs/guides/batch) (checked 2026-11-02)
- [Anthropic Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing) (checked 2026-11-02)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) (checked 2026-11-02)
- [xAI models and pricing](https://docs.x.ai/docs/models) (checked 2026-11-02)
- [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing) (checked 2026-11-02)
- [Mistral pricing](https://mistral.ai/pricing) (checked 2026-11-02)
