---
title: "Context Window Comparison"
seo_title: "LLM Context Window Comparison 2026: OpenAI, Claude, Gemini (Free) | AIEngineerGuide"
h1: "LLM context window comparison"
breadcrumb: "Context window comparison"
app_name: "Context window comparison"
description: "Compare context windows, max input and max output tokens for OpenAI, Claude, Gemini, Grok, DeepSeek and Mistral models, and check if your prompt fits. Free, no signup."
promise: "Context window, max input and max output for every major model, with a quick check of which ones fit your prompt."
tool: context-window-comparison
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Enter how many tokens you need to send, or paste the text to estimate it."
  - "Set how many tokens to reserve for the model's answer."
  - "Models that fit are marked; sort by context window, output limit or price."
faq:
  - q: "What is a context window?"
    a: "It's the maximum number of tokens a model can handle in one request: your input (system prompt, tools, conversation, documents) plus the output it generates."
  - q: "Which LLM has the largest context window?"
    a: "Sort the table by context window. Today several OpenAI, Anthropic, Google, xAI, DeepSeek and Mistral models accept around 1 million tokens; check the max input and max output columns too, since some providers cap input below the full window."
  - q: "What's the difference between context window and max output?"
    a: "The context window covers input and output together. Max output is a separate, smaller cap on how many tokens the model can generate in one response."
  - q: "Do Claude's newer models fit less text in the same window?"
    a: "Yes. Claude 4.7 and later models use a tokenizer that produces about 30% more tokens for the same text, so the same 1M-token window holds roughly 23% less text than it would on an older Claude model."
  - q: "Does a larger context window mean better results?"
    a: "Not always. Long prompts cost more, are slower and can dilute attention. Retrieval or summarization often beats stuffing everything in, even when it fits."
---

## How we calculate this

A prompt fits when its input tokens are within the model's max input (or the context window when there's no separate input cap) and input + reserved output stays within the context window, with the reserved output no larger than the model's max output.

When you paste text, we estimate tokens for each model with the provider's documented ratio: about 4 characters per token for Gemini ([Google](https://ai.google.dev/gemini-api/docs/tokens)) and as a rule of thumb for OpenAI and others, 3.5 characters per token for Claude before 4.7 ([Anthropic glossary](https://platform.claude.com/docs/en/about-claude/glossary)) and 30% more for Claude 4.7+ ([Anthropic token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)), all checked 2026-11-02. For exact OpenAI counts use the [token counter](/tools/token-counter/).

Limits and prices come from [models.dev](https://models.dev) (MIT), last data update {{< tools-models-checked >}}, and were spot-checked against official model pages on 2026-11-02. Snapshot IDs and models marked deprecated are hidden; see the [model retirement calendar](/tools/model-retirements/) for shutdown dates.
