---
title: "prefix_mismatch_behavior: drop_block"
seo_title: "prefix_mismatch_behavior drop_block: What It Does and What It Costs | AIEngineerGuide"
h1: "prefix_mismatch_behavior: \"drop_block\""
breadcrumb: "drop_block"
description: "What Claude's prefix_mismatch_behavior: \"drop_block\" does, what it costs, when to send it and when to stop. From Anthropic's docs, checked November 20, 2026."
concept: true
light_only: true
related_tool: reasoning-prefix-checker
cta_heading: "Get one practical AI engineering note a week"
faq:
  - q: "Am I billed for dropped thinking blocks?"
    a: "No, you aren't billed for the dropped blocks. But Claude can spend more output tokens working out reasoning it can no longer read, and dropping them invalidates the prompt cache from the first dropped block onward."
  - q: "Does the API remember drop_block for the conversation?"
    a: "No. The setting acts on the one request that carries it, so send it on every later request in that conversation, and store it with a saved conversation."
  - q: "Can I use drop_block with thinking disabled?"
    a: "No. With thinking off (`\"disabled\"` or `\"between_tools\"`), sending the setting is a 400 error on every model. Remove the invalid thinking by hand instead."
---

`thinking.block_binding.prefix_mismatch_behavior` chooses what happens when a thinking block fails Claude's [prefix check](/tools/reasoning-prefix-checker/). It needs the beta header `anthropic-beta: thinking-binding-controls-2026-08-01`.

| Value | If a block fails the prefix check |
|---|---|
| `"error"` | The API rejects the request with a 400 error that names the first invalid block. |
| `"drop_block"` | The API drops the invalid blocks, and the request succeeds. You aren't billed for those blocks, but dropping them can cost more. |
| Not set, or `null` | Depends on the model: a 400 on Claude Fable 5.2, Mythos 5.2 and Mythos 5.1; a possible 400 (or stale thinking read and billed) on Fable 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5. |

## Send it to stop the errors now

```json
{
  "thinking": {
    "type": "adaptive",
    "block_binding": {
      "prefix_mismatch_behavior": "drop_block"
    }
  }
}
```

Send it, with the header, on every later request in the conversation that hit the 400, because the API doesn't store the setting between requests. The next request succeeds, and its `input_transformations` array lists each block the API dropped. If your requests don't set `thinking`, adding it changes nothing else: models with preserved thinking think adaptively by default.

## What it costs

Claude can spend more output tokens working out reasoning it can no longer read, and dropping blocks invalidates the prompt cache from the first dropped block onward. When something changes on every turn, every turn loses the earlier thinking, so the cost repeats. Anthropic's advice: use `"drop_block"` to keep existing conversations going while you fix a change, and for a planned drop such as after your own summary. Don't send it on all your conversations to hide errors.

## When to stop sending it

Remove the blocks it drops and keep the thinking produced since. If nothing else has changed, the conversation then passes with `"error"`. The long-term fix is an [append-only agent](/tools/reasoning-prefix-checker/append-only-agent/).

## When not to use it

- Thinking is off (`"disabled"` or `"between_tools"`): `"drop_block"` needs `"adaptive"`, so remove the invalid thinking by hand.
- You removed a secret, personal data or injected text: `"drop_block"` leaves the thinking in your stored history, so delete every thinking block after the first place the text appeared.

## In tests

Send `"drop_block"` while you deliberately change something, so the response lists every invalid block instead of stopping at the first. Then send `"error"` on every request of your real test sessions, so any change your code makes fails the build.

Sources: [Prefix checks on thinking blocks](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking/prefix-checks#preserved-thinking-controls) and [Fix a thinking block bound to a different conversation](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking/fix-bound-to-a-different-conversation) (Anthropic, checked 2026-11-20).
