---
title: "LLM API Cost Calculator"
seo_title: "LLM API Cost Calculator: OpenAI, Claude, Gemini Pricing (Free, runs in your browser) | AIEngineerGuide"
h1: "LLM API cost calculator"
breadcrumb: "LLM cost calculator"
app_name: "LLM API cost calculator"
description: "Free LLM API pricing calculator: compare monthly cost across OpenAI, Claude, Gemini, Grok, DeepSeek and Mistral with prompt caching and batch discounts. No signup."
promise: "Compare the monthly API cost of every major model for your traffic, including prompt caching and the Batch API discount."
tool: llm-cost-calculator
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Enter your average input and output tokens per request and your requests per day. Not sure about tokens? Measure a real prompt with the [token counter](/tools/token-counter/)."
  - "Set the share of input that hits the prompt cache, and tick **Batch API** if the work can wait up to 24 hours."
  - "Sort by monthly cost, pin up to 4 models to compare, and copy the share link to send the comparison to your team."
faq:
  - q: "How is the monthly cost calculated?"
    a: "Per request: uncached input × input price + cached input × cache read price + output × output price, all per million tokens. The monthly cost is that × requests per day × 30. With the Batch API ticked, we halve it for providers whose pricing pages list a 50% batch discount."
  - q: "Which providers offer a 50% batch discount?"
    a: "OpenAI, Anthropic, Google (Gemini API) and Mistral all list a 50% discount for batch processing on their official pricing pages. Models from other providers show \"n/a\" when Batch is ticked."
  - q: "Why is my real bill different?"
    a: "Common reasons: long-context pricing tiers (for example OpenAI prices prompts over 272K tokens at 2x input), reasoning tokens billed as output, tool definitions and images adding input tokens, regional or priority processing surcharges, and promotional prices that end."
  - q: "Is prompt caching worth it?"
    a: "Usually, if the same prefix (system prompt, tools, documents) is reused within the cache lifetime. On Anthropic's 5-minute cache a write costs 1.25x input and a hit 0.1x, so it pays off after one hit. Use the Prompt caching tab to check your numbers."
  - q: "How often are prices updated?"
    a: "A daily job pulls prices from models.dev into a pull request that's reviewed before publishing, and we spot-check them against the official pricing pages. Always confirm on the provider's page before you commit to a budget."
---

## How we calculate this

**Cost per request** = (uncached input × input price + cached input × cache read price + output × output price) ÷ 1,000,000, with prices in USD per million tokens. **Monthly cost** = cost per request × requests per day × 30. The Batch API option halves the result for providers that list a 50% batch discount. The Prompt caching tab compares writing a prefix once and reading it *n* times against sending it uncached *n* + 1 times; break-even is the smallest *n* where caching is cheaper.

Prices come from [models.dev](https://models.dev) (MIT), last data update {{< tools-models-checked >}}. On 2026-11-02 we checked 29 models against the official pages: all 17 Anthropic models matched exactly, as did gpt-5.6-sol/terra/luna, gpt-6-luna, gpt-4o, gpt-4.1, gemini-3.8-flash, gemini-3.5-flash-lite, gemini-3.1-pro-preview, grok-4.7 and deepseek-v4-pro.

### Things this calculator doesn't model

- **Long-context tiers.** OpenAI: "Prompts with >272K input tokens are priced at 2x input and 1.5x output for the full request." Gemini 3.1 Pro and Claude Haiku 5.5 also have higher prices above 200K and 100K-token prompts respectively. We show the standard tier.
- **Promotional prices.** gpt-5.6-sol's current price runs "at least through November 21, 2026". gemini-3.8-flash is priced as shown "through December 31, 2026", rising to $1.50 / $7.50 per million input/output tokens on January 1, 2027.
- **DeepSeek peak hours.** The listed DeepSeek prices are off-peak rates; peak rates (01:00–04:00 and 06:00–10:00 UTC on weekdays) are double.
- **Surcharges.** Priority or fast modes, regional or data-residency endpoints (for example a 1.1x multiplier for Anthropic US-only inference) and Gemini cache storage per hour.
- **`mistral-large-latest`** points to Mistral Large 3, which Mistral deprecated on October 31, 2026 in favor of Mistral Large 4.

### Official pricing pages

- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) and [Batch API guide](https://developers.openai.com/api/docs/guides/batch) (checked 2026-11-02)
- [Anthropic Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing) (checked 2026-11-02)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) (checked 2026-11-02)
- [xAI models and pricing](https://docs.x.ai/docs/models) (checked 2026-11-02)
- [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing) (checked 2026-11-02)
- [Mistral pricing](https://mistral.ai/pricing) (checked 2026-11-02)
