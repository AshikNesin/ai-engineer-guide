---
title: How to use GLM-5 in pi.dev Coding Agent
url: blog/glm-5-in-pi-coding-agent
tags:
  - pi
  - glm-5
  - glm-coding-plan
status: published
date: 2026-02-15T00:00:00.000Z
qblog_id: 11528d1f-8ceb-444f-9b3b-4dc0ac93152b
---

[pi.dev](https://pi.dev) is the minimal but heavily extensible coding agent that OpenClaw. I really like it's simplicity.

It has out of support for using your AI subscription like ChatGPT, Anti Gravity IDE, etc

However it doesn't have support for GLM Coding plan yet but you can configure it manually.

Replace `baseUrl` with `https://api.z.ai/api/paas/v4` if you want to use standard (pay per use) API billing.

```json
{
  "providers": {
    "zai": {
      "baseUrl": "https://api.z.ai/api/coding/pass/v4",
      "api": "openai-completions",
      "apiKey": "ZAI_API_KEY",
      "compat": { "supportsDeveloperRole": false, "thinkingFormat": "zai" },
      "models": [
        {
          "id": "glm-5",
          "name": "GLM-5 (GLM Coding Plan)",
          "reasoning": true,
          "input": ["text"],
          "cost": {
            "input": 0.15,
            "output": 0.6,
            "cacheRead": 0,
            "cacheWrite": 0
          },
          "contextWindow": 128000,
          "maxTokens": 4096
        }
      ]
    }
  }
}

``` 

Once you've configured it, you should not be able to see `glm-5` in your `pi` agent now in `/model` command. If it doesn't show up then try running `/reload`command.

![2026-02-13-at-20.42.24.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/qkmchzrlwh7xjeqdzzlg)

## Reference
- https://x.com/imaurer/status/2021666369708994990
- https://github.com/badlogic/pi-mono/discussions/1475