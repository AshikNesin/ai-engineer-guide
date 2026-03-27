---
title: How to use GLM-5.1 in Claude Code
url: til/claude-code-glm-5-1
tags:
  - glm-5-1
  - claude-code
status: published
date: 2026-03-27T00:00:00.000Z
qblog_id: c8817ecc-60b9-4ff4-be7f-1b379bb2c3bd
---

[z.ai](https://z.ai) has released GLM 5.1 which according to benchmark is top **coding model** which performs well slightly below Claude Opus 4.6.

It is now available in all [GLM Coding Plan](https://go.nesin.io/glm) and via their API as well.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/erxpxbkhh6qupj4gyckz)

To use it in Claude Code, you need to update the model id in claude settings `~/.claude/settings.json`

```
{
 "env": {
    "ANTHROPIC_AUTH_TOKEN": "$ZAI_API_KEY",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.1",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.1"
  }
}
```

## Reference
- https://x.com/Zai_org/status/2037490078126084514/photo/1