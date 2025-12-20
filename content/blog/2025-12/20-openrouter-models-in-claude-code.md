---
title: How to use any OpenRouter AI models in Claude Code
url: blog/openrouter-models-in-claude-code
tags:
  - claude-code
  - openrouter
status: published
date: 2025-12-20T00:00:00.000Z
qblog_id: 83d7aae6-8cde-4f91-8fd5-7c794b6ea1ca
---

OpenRouter now supports Anthropic API shapes which means now we can use any models (320+) that is available in OpenRouter with Claude Code.

Yeah! even the free ones (39+)

## How to get started?
Just set these env variables before starting the Claude Code.

```sh
export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"
export ANTHROPIC_API_KEY="" # Important: Must be explicitly empty
```

By having this in ~/.bashrc or ~/.zshrc, you'll be able to use Claude code with those models anywhere (global config)

If you want to set up project level then you can set it in `.claude/settings.local.json`

```json
{
"env": {
"ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
"ANTHROPIC_AUTH_TOKEN": "<your-openrouter-api-key>",
"ANTHROPIC_API_KEY": ""
}
}
```

Note: `ANTHROPIC_API_KEY` needs to be set as empty string. If not the Claude Code will fallback to login flow.

## Reference
- [OpenRouter Doc](https://openrouter.ai/docs/guides/guides/claude-code-integration)