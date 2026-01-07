---
title: How to use any AI model from Vercel AI Gateway with Claude Code
url: blog/vercel-ai-gateway-with-claude-code
tags:
  - claude-code
  - vercel
status: published
date: 2026-01-07T00:00:00.000Z
qblog_id: bc0ce7f8-7d5a-45b6-a28d-50840cebc8ac
---

[Vercel AI Gateway](https://aiengineerguide.com/blog/vercel-ai-gateway/) now has support for Claude Code. Similar to that of [GLM Coding Plan](https://go.nesin.io/glm) you just need to update the base url and keys and we're good to go.

Basically under the hood, they've built transform the payload from LLM back and forth to make it behave like Anthropic-like API endpoint so that it works as expected in Claude Code.

## How to get started?

Just set these env variables.

```
export ANTHROPIC_BASE_URL="https://ai-gateway.vercel.sh"
export ANTHROPIC_AUTH_TOKEN="your-vercel-ai-gateway-api-key"
export ANTHROPIC_API_KEY=""
```

And then run `claude`

That's pretty much it.

By default, it'll use Anthropic models but you can override it by setting these env variables

```shell
export ANTHROPIC_DEFAULT_SONNET_MODEL="kwaipilot/kat-coder-pro-v1"
export ANTHROPIC_DEFAULT_OPUS_MODEL="zai/glm-4.7"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="minimax/minimax-m2.1"
```

## Reference
- [AI Gateway support for Claude Code - Vercel](https://vercel.com/changelog/ai-gateway-support-for-claude-code)
- [Claude Code](https://vercel.com/docs/ai-gateway/claude-code)