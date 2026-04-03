---
title: How to use Xiaomi MiMo Token Plan models in OpenCode
url: til/xiaomi-mimo-token-plan-models-in-opencode
tags:
  - xiaomi-mimo
status: published
date: 2026-04-03T00:00:00.000Z
qblog_id: 33c55247-2695-4c2d-91d4-9efc89cd60c8
---

Xiaomi has recently launched their Token Plan (monthly subscription) where you'll get a fixed tokens with no 5-hour usage limits like others

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/p2guavdgg3zoevcnmkh7)

👉 http://platform.xiaomimimo.com

If you want to use this in your OpenCode, you might need to create a [custom provider](https://opencode.ai/docs/providers/#custom-provider) and use it for now.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "mimo-token-plan": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "MiMo (Token Plan)",
      "options": {
        "baseURL": "https://token-plan-sgp.xiaomimimo.com/v1",
        "apiKey": "{env:MIMO_API_KEY}"
      },
      "models": {
        "mimo-v2-pro": {
          "name": "MiMo-V2-Pro",
          "limit": {
            "context": 1048576,
            "output": 131072
          },
          "modalities": {
            "input": ["text"],
            "output": ["text"]
          }
        }
      }
    }
  }
}
```

## Reference
- https://x.com/XiaomiMiMo/status/2039918061025972358