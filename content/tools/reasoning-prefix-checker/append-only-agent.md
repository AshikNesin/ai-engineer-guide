---
title: "Append-only agent loops"
seo_title: "Append-Only Agent: Keep Claude Thinking and GPT-6.2 Reasoning Valid | AIEngineerGuide"
h1: "Build an append-only agent: keep Claude thinking and GPT-6.2 reasoning"
breadcrumb: "Append-only agent"
description: "Anthropic's three habits for an append-only integration next to OpenAI's keep-the-prefix-unchanged table: how to change the date, tools, effort and history without losing reasoning."
concept: true
light_only: true
related_tool: reasoning-prefix-checker
cta_heading: "Get one practical AI engineering note a week"
faq:
  - q: "Why do both providers want append-only requests?"
    a: "Each thinking block or reasoning item is reasoning about exactly what came before it. If that changes, the reasoning is about content that's gone: Claude's newer models reject or drop it, and GPT-6.2 removes it."
  - q: "Can I still trim old history?"
    a: "On Claude, let the API summarize with on-demand compaction, or remove the kept turns' thinking (or send `drop_block`) when your own code cuts. On OpenAI, deleting whole items without editing the rest doesn't trigger `prefix_mismatch`, and OpenAI compaction keeps later reasoning."
---

Both Anthropic and OpenAI now tie earlier reasoning to the exact conversation before it. Change anything before it and Claude's newer models return a 400 (or drop it), while GPT-6.2 silently removes it. The fix is the same on both: leave what you sent as it was, and add updates at the end.

## Anthropic's three habits

From [Prefix checks on thinking blocks](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking/prefix-checks#prefix-check):

1. Send each assistant turn back exactly as the API returned it, including thinking blocks whose text is empty.
2. Build `system` and `tools` once for each conversation, and send that copy every time.
3. Put every update in a new message at the end, and leave it there.

| If your code… | Do this instead |
|---|---|
| Puts today's date, a mode or instruction files in `system` | Keep `system` fixed. State new values in a text block of the newest user message, or append a `role: "system"` message after the newest user message. |
| Adds, removes or rewords a tool, or gains tools when an MCP server connects | Keep `tools` fixed. Append a system message with a `tool_addition` or `tool_removal` block (header `inline-tools-2026-09-15`, or `mid-conversation-tool-changes-2026-07-01` for tools declared up front with `defer_loading`). |
| Turns tools off for one turn | `tool_choice: {"type": "none"}`, keeping `tools`. |
| Trims or summarizes older turns | On-demand compaction, or remove the kept turns' thinking / send `"drop_block"`. Cut rarely, in large steps. |
| Shortens old tool results or images | Shorten before the first send, or use context editing (`clear_tool_uses_20250919`). |
| Skips thinking blocks that look empty | Send them back: the `signature` holds the reasoning. Leave out only the oldest, the newest or all thinking. |

Source: [Change tools or instructions without failing the prefix check](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking/change-tools-or-instructions) (checked 2026-11-20).

## OpenAI's keep-the-prefix-unchanged table

From [Keep the prefix unchanged](https://developers.openai.com/api/docs/guides/keep-prefix-unchanged) and the [reasoning guide](https://developers.openai.com/api/docs/guides/reasoning):

| Change | Append-only way |
|---|---|
| Changing reasoning effort | Keep `reasoning.effort`; append a `configuration_update` item with the new effort before the next user message. |
| Changing structured output schemas | Keep `text.format`; append a `configuration_update` item with the new format. |
| Changing the tools available to the agent | Keep `tools`; use an `additional_tools` item, replayed in its original position. Or limit tools with `tool_choice` (`allowed_tools` or `"none"`). |
| Updating developer instructions | Append a new `developer` message. On GPT-6.2+, top-level `instructions` are appended after `input`, so they're fine for turn-scoped guidance. |
| Compaction | OpenAI compaction keeps later reasoning items; with your own, put the compacted item at the end. |
| Shortening past tool outputs or downsizing past files / images | Shorten before you first send them. |

Also send the same `safety_identifier` on every request of a conversation (or none): a different one removes reasoning with `end_user_mismatch` on GPT-6.2.

## Check your code

Capture two consecutive request bodies from one session (ideally one with a tool change, a compaction or a new day) and paste them into the [prefix checker](/tools/reasoning-prefix-checker/). In tests, set Claude's `thinking.block_binding.prefix_mismatch_behavior` to `"error"` (with the beta header `anthropic-beta: thinking-binding-controls-2026-08-01`) so every change fails loudly, and fail on any `prefix_binding_mismatch` entry.
