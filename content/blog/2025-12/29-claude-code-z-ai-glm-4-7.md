---
title: How to use Claude Code with z.ai GLM-4.7
url: blog/claude-code-z-ai-glm-4-7
tags:
  - claude-code
status: published
date: 2025-12-29T00:00:00.000Z
qblog_id: 533e1924-f9fa-4264-8f59-64b1ddb17658
---

Using the latest model GLM 4.7 from z.ai is straightforward

Just get the API key from the dashboard

https://z.ai/manage-apikey/apikey-list

Then you just need to set these things in the claude settings which is located at `~/.claude/settings.json`

```json
{
    "env": {
        "ANTHROPIC_AUTH_TOKEN": "your_zai_api_key",
        "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
        "API_TIMEOUT_MS": "3000000"
    }
}
```

You can also set these things so that the model names are configured properly as well.

```json
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"

```
## Reference
https://docs.z.ai/devpack/tool/claude