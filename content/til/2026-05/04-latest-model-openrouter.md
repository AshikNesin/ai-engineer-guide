---
title: How to use the latest LLM models automatically in OpenRouter
url: til/latest-model-openrouter
tags:
  - openrouter
status: published
date: 2026-05-04T00:00:00.000Z
qblog_id: badde395-bbe8-4016-a461-2f24934f6cd7
---

OpenRouter now lets you automatically point to latest model so that you don't have to worry about updating the model every 3/6 months.

Instead of explictly defining the latest version by adding `~` prefix and `-latest` suffix.

Like this:

- `~anthropic/claude-haiku-latest`
- `~openai/gpt-mini-latest`
- `~google/gemini-pro-latest`
- `~moonshotai/kimi-latest`
- `~google/gemini-flash-latest`
- `~anthropic/claude-sonnet-latest`
- `~openai/gpt-latest`
- `~anthropic/claude-opus-latest`

You can find other models here: https://openrouter.ai/models?q=latest

## Reference
- https://x.com/OpenRouter/status/2050610378971738552