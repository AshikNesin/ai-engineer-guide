---
title: Z.ai's GLM 4.6 - A Open Source Alternative to Sonnet 4
url: blog/z-ai-glm-4-6
tags:
  - z-ai
  - glm-4-6
status: published
date: 2025-09-30T00:00:00.000Z
qblog_id: 801e1e1f-4998-49da-9bdb-836f6bb6c6de
---

Another day, another LLM 😅

Just a day after Anthropic's Sonnet 4.5 release, Z.AI has released there open source LLM - GLM 4.6 and based on the benchmarks it is as good as Sonnet 4.

And it is a decent model to be honest. I've tried for my side projects.

The major upgrade from previous version are:
- **Larger Context Window** - From 128K to 200K tokens
- And the improvement in **reasoning performance** and **tool use** which leads to better performance overall.

For those who prefers benchmarks 👇
![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/pky9z8ce8dhfvtkvkxsy)

## How to get started?
You can use their API via Z.ai API platform like this

```shell
curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $Z_AI_API_KEY" \
-d '{
  "model": "glm-4.6",
  "messages": [
    {
      "role": "user",
      "content": "Why sky is blue?"
    }
  ]
}'
```

Replace $Z_AI_API_KEY with [your API key](https://z.ai/manage-apikey/apikey-list).

## GLM Coding Plan subscribers
If you already have GLM Coding Plan subscription, then you should be able to use this model as well.

In case if you face any issue then it might be due to wrong model number. In such cases, you can update the model name to `glm-4.6` and the issue should be sorted out.

## Reference
[GLM-4.6: Advanced Agentic, Reasoning and Coding Capabilities](https://z.ai/blog/glm-4.6)