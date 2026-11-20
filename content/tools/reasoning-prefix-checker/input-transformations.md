---
title: "input_transformations Decoder"
seo_title: "input_transformations Decoder for Claude and OpenAI (Free, runs in your browser) | AIEngineerGuide"
h1: "input_transformations decoder for Claude and OpenAI"
breadcrumb: "Decode a response"
app_name: "input_transformations decoder"
description: "Paste a Claude or OpenAI response, an SSE stream or a 400 error. See what each input_transformations entry means, whether it's yours to fix, and the fix. Free, runs in your browser."
promise: "Paste a response, a stream or a 400 error body. Each `input_transformations` entry gets a plain-English meaning, whether it's yours to fix, and the fix."
tool: reasoning-prefix-checker
tab: decode
light_only: true
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste an Anthropic or OpenAI response, an Anthropic SSE stream, a 400 error body, or just the `input_transformations` array."
  - "Optionally paste the request too, so each `path` (Claude) or `id` (OpenAI) resolves to the block it names."
  - "Fix the entries marked **Yes**. Model and account entries are expected after a switch."
faq:
  - q: "What is input_transformations?"
    a: "An array in the response that lists thinking blocks (Claude) or reasoning items (OpenAI) the API dropped or let through. On Claude it needs the `thinking-binding-controls-2026-08-01` beta header and sits beside `usage`; on OpenAI it's a top-level array of `{id, action, reason, type}`, in input order."
  - q: "Why does the error's position differ from the entry's path?"
    a: "The 400 error counts a `role: \"system\"` message, or one with the same role as the message before, as part of that earlier message, so the position it names can be lower than the index in your array. An `input_transformations` path is always the block's place as you sent it."
  - q: "Where is it in a stream?"
    a: "In the `message_start` event's `message`. After a mid-stream fallback, the final `message_delta` event carries the one that counts."
---

## How the decoder works

It finds `input_transformations` in whatever you paste and matches each entry's `type` and `reason` against the official tables: Anthropic's "What each `input_transformations` entry means" and OpenAI's "Reasoning item removal across requests". Unknown entries are shown raw, because Anthropic's docs say to ignore an entry whose `type` or `reason` you don't recognize.

Error bodies are matched on the exact phrases Anthropic says to match, in order: "The block is bound to a different conversation", the beta-header sentence, `block_binding: Extra inputs are not permitted`, and the look-alike signature errors.

{{< reasoning-sources >}}
