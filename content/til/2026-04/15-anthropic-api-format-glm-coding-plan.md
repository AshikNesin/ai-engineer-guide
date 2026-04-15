---
title: Anthropic API format for GLM Coding Plan
url: til/anthropic-api-format-glm-coding-plan
tags:
  - glm-coding-plan
  - anthropic
status: published
date: 2026-04-15T00:00:00.000Z
qblog_id: 6e0b292c-4693-4680-826c-1bcf9833e577
---

GLM Coding Plan supports both Anthropic API messages API format as well as OpenAI messages format.

So if you want to use the GLM Coding plan with say your Claude Code or an Claude SDK, you can use just change their base url and pass on your ZAI API key which should do the trick.

```
https://api.z.ai/api/anthropic
```
For example, your request will be something like this

```shell
curl -X POST https://api.z.ai/api/anthropic/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ZAI_API_KEY" \
  -d '{
    "model": "glm-5-turbo",
    "max_tokens": 100,
    "messages": [
      {"role": "user", "content": "Why sky is blue?"}
    ]
  }'
  ```

  ![2026-04-15-at-22.44.40.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/fjpxqjwpnchcmmbkzo2s)
