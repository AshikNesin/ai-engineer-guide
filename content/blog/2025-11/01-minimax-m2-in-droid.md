---
title: How to use MiniMax M2 in Droid
url: blog/minimax-m2-in-droid
tags:
  - claude-code
  - minimax-m2
status: published
date: 2025-11-01T00:00:00.000Z
qblog_id: bafa0d78-7eed-4996-bc0c-23894562da92
---

MiniMax M2 a new open source model (open weight) that is specifically built for coding & agentic workflows.

In term of cost, it is Input tokens - $0.30/million and  $1.20/million for output token.

For limited period they're offering their service for free (until Nov 7, 2025)

## Getting Started 
First, you need to get the MiniMax API key which you can get it [platform](https://platform.minimax.io/login)

### Droid CLI
Add MiniMax as custom model in 

`~/.factory/config.json`

```json
{
    "custom_models": [
        {
            "model_display_name": "MiniMax-M2",
            "model": "MiniMax-M2",
            "base_url": "https://api.minimax.io/anthropic",
            "api_key": "<MINIMAX_API_KEY>",
            "provider": "anthropic",
            "max_tokens": 16384
        }
    ]
}
```

You can refer to [their docs](https://platform.minimax.io/docs/guides/text-ai-coding-tools#install-claude-code) on how to use it in VS Code Extention, Cursor, Codex, etc

## Reference
- [MiniMax M2 & Agent: Ingenious in Simplicity - MiniMax News](https://www.minimax.io/news/minimax-m2)