---
title: How to use DeepSeek LLM in Claude Code
url: blog/deepseek-llm-in-claude-code
tags:
  - deepseek
  - claude-code
status: published
date: 2025-08-24T00:00:00.000Z
qblog_id: 073b4bc7-da7f-477b-9306-6a9ec51821de
---

DeepSeek, via their platform, now has support for an Anthropic-like [API format](https://api-docs.deepseek.com/guides/anthropic_api) which means you can now use it with your Claude Code 🔥

## How to get started?
Just set these environment variables, and then you can start using DeepSeek in Claude Code.

```shell
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=${YOUR_API_KEY}
export ANTHROPIC_MODEL=deepseek-chat
export ANTHROPIC_SMALL_FAST_MODEL=deepseek-chat
```

```shell
claude
```

Make sure to configure your DeepSeek API key that you get from their [platform](https://platform.deepseek.com).

## Reference
- https://api-docs.deepseek.com/guides/anthropic_api

Happy AI coding!