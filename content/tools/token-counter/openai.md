---
title: "OpenAI Token Counter"
seo_title: "OpenAI Token Counter: o200k_base & cl100k_base (Free, runs in your browser) | AIEngineerGuide"
h1: "OpenAI token counter"
breadcrumb: "OpenAI"
app_name: "OpenAI token counter"
description: "Free OpenAI token counter with exact o200k_base and cl100k_base counts for GPT-5, GPT-4o, GPT-4.1 and o-series models, plus cost. No signup, runs in your browser."
promise: "Exact OpenAI token counts for GPT-5, GPT-4o, GPT-4.1 and o-series models, with a token-by-token view."
tool: llm-cost-calculator
related_tool: token-counter
tab: tokens
preselect: openai
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste your prompt or drop a text file."
  - "Use the `o200k_base` row for GPT-4o and newer models, and `cl100k_base` for GPT-4, GPT-4 Turbo and GPT-3.5 Turbo."
  - "Open **View OpenAI tokens** to see exactly how your text is split."
faq:
  - q: "Is this the same as OpenAI's tiktoken?"
    a: "Yes, for the text itself. It uses the `o200k_base` and `cl100k_base` encodings through gpt-tokenizer, which matches tiktoken's output. Chat requests add a few tokens per message for formatting, which this counter doesn't include."
  - q: "Which encoding does GPT-5 use?"
    a: "GPT-4o, GPT-4.1, the GPT-5 family and later models, and o-series reasoning models use `o200k_base`."
  - q: "Do reasoning tokens count toward my bill?"
    a: "Yes. Reasoning models bill hidden reasoning tokens as output tokens. This counter measures the text you send, so budget extra output for reasoning."
  - q: "Is my text sent to OpenAI?"
    a: "No. Tokenization runs in your browser and nothing is uploaded."
---

## How we count OpenAI tokens

Counts are exact for the text you paste. They're computed in your browser with [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) 4.1.0 (MIT), using OpenAI's `o200k_base` and `cl100k_base` encodings. We check it against tiktoken's test vectors, for example `hello world` encodes to `[24912, 2375]` in `o200k_base` (checked 2026-11-02).

A Chat Completions or Responses request adds a few tokens per message for roles and formatting, and tool definitions are counted too, so your billed input will be slightly higher than the count here.
