---
title: "Claude Token Counter"
seo_title: "Claude Token Counter (Free, runs in your browser) | AIEngineerGuide"
h1: "Claude token counter"
breadcrumb: "Claude"
app_name: "Claude token counter"
description: "Free Claude token counter: estimate tokens for Claude 4.7+ and earlier Claude models, with cost and context use per model. No signup, runs in your browser."
promise: "Estimate Claude tokens for your prompt, including the newer Claude 4.7+ tokenizer, and see what it costs."
tool: llm-cost-calculator
related_tool: token-counter
tab: tokens
preselect: claude
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste your prompt or drop a text file."
  - "Use the **Claude 4.7 and later** row for Opus 4.7+, Sonnet 5.x, Haiku 5.5, Fable and Mythos, and the other Claude row for older models."
  - "Pick a Claude model to see input and output cost and context window use."
faq:
  - q: "How many tokens does Claude use per word?"
    a: "On Claude models before 4.7, a token is about 3.5 English characters, according to Anthropic's glossary. Claude 4.7 and later models use a newer tokenizer that produces about 30% more tokens for the same text."
  - q: "Why does the same prompt cost more tokens on newer Claude models?"
    a: "Claude Opus 4.7 introduced a new tokenizer, shared by later models. Anthropic says the same input produces approximately 30 percent more tokens, so recount prompts before you compare costs or check context fit."
  - q: "Is this an exact Claude token count?"
    a: "No. Anthropic doesn't publish a browser tokenizer, so this is an estimate. For an exact count, call the free [`/v1/messages/count_tokens`](https://platform.claude.com/docs/en/build-with-claude/token-counting) endpoint with the model you plan to use."
  - q: "Do tool definitions and images count toward Claude's input tokens?"
    a: "Yes. Tools, the system prompt and images all add input tokens, and this counter only measures the text you paste. Anthropic's [token counting endpoint](https://platform.claude.com/docs/en/build-with-claude/token-counting) accepts the same inputs as a message request, including the system prompt, tools, images and PDFs."
---

## How we estimate Claude tokens

For Claude models before 4.7 we divide the character count by 3.5, from Anthropic's [glossary](https://platform.claude.com/docs/en/about-claude/glossary). For Claude 4.7 and later we multiply that by 1.3, because Anthropic's [token counting docs](https://platform.claude.com/docs/en/build-with-claude/token-counting) say the newer tokenizer "produces approximately 30 percent more tokens". Both checked 2026-11-02.

These ratios hold for English prose. Code, JSON and other languages usually produce more tokens, so treat the estimate as a lower bound and leave headroom. Tool definitions, system prompts and images also add tokens. For exact numbers use Anthropic's free token counting endpoint.
