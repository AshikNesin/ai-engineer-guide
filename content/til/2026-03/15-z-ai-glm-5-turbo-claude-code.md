---
title: How to use z.ai - GLM-5-Turbo in Claude Code
url: til/z-ai-glm-5-turbo-claude-code
tags:
  - claude-code
  - glm-5-turbo
status: published
date: 2026-03-15T00:00:00.000Z
qblog_id: e8fa9424-1994-49f7-8674-e5bab30e58f4
---

Pony Alpha 2 is the latest stealth LLM that is specifically trained for faster response (and I believe the response won't be as good as GLM-5) but for certain use cases for causal interaction where you want speed more than accuracy it might be useful.

To use Pony Alpha 2 with Claude Code, you just need to configure your env variables in `~/.claude/settings.json` or set it in shell before invoking Claude Code

```json
{
   "env": {
    "ANTHROPIC_AUTH_TOKEN": "$ZAI_API_KEY",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5-turbo",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5-turbo",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5-turbo"
  }
}
```
Depending on your preference you can use it for `ANTHROPIC_DEFAULT_SONNET_MODEL` and `ANTHROPIC_DEFAULT_OPUS_MODEL` model as well but it might not be as good as `glm-5`


## Reference
- z.ai Discord