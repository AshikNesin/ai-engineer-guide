---
title: Anthropic Claude Opus 4.7 uses 33% more tokens than Opus 4.6
url: til/anthropic-claude-opus-4-7-uses-more-tokens
tags:
  - anthropic
  - claude-opus-4-7
status: published
date: 2026-04-17T00:00:00.000Z
qblog_id: 2e97c122-63d0-43b0-9949-cfcf17073a0f
---

Even though the cost of Claude Opus 4.6 & Claude Opus 4.7 is same ($5/M input tokens and $25/M output tokens).

However, Claude Opus 4.7 uses **different tokenizer** which might use up to 33% more token usage for the same input if you compare it with Opus 4.6 or other models.

They've explictly called that out in their website.

> Opus 4.7 uses a new tokenizer compared to previous models, contributing to its improved performance on a wide range of tasks. This new tokenizer may use up to 35% more tokens for the same fixed text.

And also it **thinks more** at higher effort levels (including xhigh), so effectively increases it even further.

## Reference
- https://platform.claude.com/docs/en/about-claude/pricing

