---
title: "Thinking Block Prefix Checker"
seo_title: "Will My Thinking Blocks Survive? Prefix Checker for Claude and GPT-6.2 (Free, runs in your browser) | AIEngineerGuide"
h1: "Will my thinking blocks survive? Prefix checker for Claude and GPT-6.2"
breadcrumb: "Reasoning prefix checker"
app_name: "Thinking block prefix checker"
description: "Paste two API requests and see which Claude thinking blocks or GPT-6.2 reasoning items survive: 400 error, dropped, or fine, with the first change and the append-only fix. Free, runs in your browser."
promise: "Paste an earlier request and the next one. See the first change before any thinking block, which blocks it invalidates, what each model does (400, dropped or fine) and the documented fix."
tool: reasoning-prefix-checker
tab: prefix
layout: tool
light_only: true
outputs: ["HTML"]
cascade:
  light_only: true
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste the earlier request (or the one that worked) on the left and the next request (or the one that failed) on the right. JSON bodies and SDK calls with literal values both work. For a whole session, tick **Or paste a log** and paste a JSON array or JSONL."
  - "Check the target models. They're preselected from B's `model` plus every model that runs the check."
  - "Read the verdict per model, the first change (with a mini diff), and the fix. Copy the snippet, or copy the whole report as Markdown."
faq:
  - q: "Why does Claude Fable 5.2 return \"The block is bound to a different conversation\"?"
    a: "Something before a thinking block you sent back changed after Claude produced it: `system`, `tools` or an earlier message. Common causes are today's date in the system prompt, MCP tools appearing mid-chat, trimmed history, and serializers that drop empty thinking blocks. Claude Fable 5.2 and Mythos 5.2 enforce the check on every account since November 9, 2026."
  - q: "Which Claude models run the prefix check?"
    a: "Claude Fable 5.2, Mythos 5.2, Fable 5.1, Mythos 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5. With `prefix_mismatch_behavior` unset, Fable 5.2, Mythos 5.2 and Mythos 5.1 return a 400; the others might return a 400, or let the stale thinking through and bill it. Claude Opus 5 and earlier models don't run it."
  - q: "Does GPT-6.2 return an error when I edit the conversation?"
    a: "No. Starting with GPT-6.2, the Responses API silently drops reasoning items after a prefix edit and lists them in `input_transformations` with the reason `prefix_mismatch`. Deleting whole items without editing the rest doesn't trigger it, and top-level `instructions` are appended after `input` on GPT-6.2, so changing them isn't a prefix edit there."
  - q: "What doesn't count as a change on Claude?"
    a: "`model`, `effort`, `max_tokens`, `tool_choice`, `metadata`, `thinking.display` and other parameters; JSON formatting and key order; `cache_control` markers; and a tool with `defer_loading: true` that nothing has referred to yet."
  - q: "Is what I paste sent anywhere?"
    a: "No. Parsing and checks run in your browser, and the page makes no network requests with your input. It isn't stored or put in the URL. Remove secrets anyway: your clipboard and screen can still leak them."
---

## How the checker works

It works out the API (Anthropic Messages or OpenAI Responses) and compares the two requests the way the provider does. On Claude that means `system`, `tools` and every earlier message, as parsed JSON, ignoring `cache_control` and tools with `defer_loading: true` that nothing has referred to. It also checks that the thinking blocks you send form an unbroken run. On OpenAI it aligns the `input` items and checks `tools`, `text.format`, `reasoning.effort`, `instructions` (before GPT-6.2 only) and `safety_identifier`.

The **first change** is the earliest difference before a thinking block or reasoning item. Every block after it, produced before B, is invalid. Then each target model gets its documented outcome:

- 🔴 **400 error**: Claude Fable 5.2, Mythos 5.2 and Mythos 5.1 with the setting unset, or any model with `prefix_mismatch_behavior: "error"`.
- 🟠 **Possible 400, or stale thinking billed**: Claude Fable 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5 with the setting unset.
- 🟡 **Dropped, no error**: GPT-6.2 (`prefix_mismatch`), Claude with `"drop_block"` (not billed, but it can cost more), and Message Batches items.
- 🟢 **Nothing happens**: no change before any thinking, or a model that doesn't run the check.
- ⚪ **Can't tell**: no thinking in B, history stored server-side, or a change the docs don't confirm.

What it can't see: files fetched by URL (the API compares the bytes), MCP tool lists the API fetches, headers your SDK adds, and Gemini (we found no Gemini docs about prefix-bound reasoning). Where the docs don't say something, the checker says so instead of guessing.

More: [what `drop_block` does and costs](/tools/reasoning-prefix-checker/drop-block/), [how to build an append-only agent](/tools/reasoning-prefix-checker/append-only-agent/), [every reason code](/tools/reasoning-prefix-checker/reasons/) and [every error message](/tools/reasoning-prefix-checker/errors/).

{{< reasoning-sources >}}
