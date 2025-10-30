---
title: How to use MiniMax M2 in Claude Code
url: blog/minimax-m2-in-claude-code
tags:
  - claude-code
  - minimax-m2
status: published
date: 2025-10-30T00:00:00.000Z
qblog_id: 9b1bb5b1-29fc-4d6a-8060-88bed629d48e
---

MiniMax M2 a new open source model (open weight) that is specifically built for coding & agentic workflows.

They claim to be be as good as Sonnet 4 but at a fraction of the cost.

You can access the model via API. 

In term of cost, it is Input tokens - $0.30/million and  $1.20/million for output token.

But you can access it for free until November 7th.

Similar to GLM 4.6, they also has first class support for Anthropic like API response which means we can use it with our Claude Code

## Getting Started 
First, you need to get the MiniMax API key which you can get it [platform](https://platform.minimax.io/login)

### Claude Code CLI
Once you're done, you can update it in `~/.claude/settings.json` 

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.minimax.io/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<MINIMAX_API_KEY>",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
    "ANTHROPIC_MODEL": "MiniMax-M2",
    "ANTHROPIC_SMALL_FAST_MODEL": "MiniMax-M2",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "MiniMax-M2",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "MiniMax-M2",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "MiniMax-M2"
  }
}
```

Make sure to replace your key in `ANTHROPIC_AUTH_TOKEN`. And as you can see we're pretty much using MiniMax-M2 model for everything.

You can refer to [their docs](https://platform.minimax.io/docs/guides/text-ai-coding-tools#install-claude-code) on how to use it in VS Code Extention, Cursor, Codex, Droid, etc

## Reference
- [MiniMax M2 & Agent: Ingenious in Simplicity - MiniMax News](https://www.minimax.io/news/minimax-m2)