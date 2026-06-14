---
title: OpenRouter's Model Fusion API
url: til/openrouter-model-fusion-api
tags:
  - openrouter
status: published
date: 2026-06-14T00:00:00.000Z
qblog_id: 4421ba82-5802-4ee9-ae66-4fecdad058ee
---

OpenRouter has released model fusion feature which they claim it performs in **Fable-level intelligence at half the price**

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/kwoiqcyzxzhnbi24vo4u)

## How does it work?
> When you send a prompt to Fusion, we fan it out to a panel of models in parallel, each with web search and bash tools enabled.

> A judge model reads every response and extracts the structure: consensus points, contradictions, partial coverage, unique insights, blind spots.

So the TLDR is in combines the context from all the models for the given prompt and synthesises the final answer.

## How to use it?

Just add `openrouter:fusion` in tools like this

```shell
curl https://openrouter.ai/api/v1/chat/completions \
  -X POST \
  -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "~anthropic/claude-opus-latest",
    "messages": [
      {
        "role": "user",
        "content": "Survey the strongest arguments for and against a multi-universe. Where do experts disagree?"
      }
    ],
    "tools": [
      { "type": "openrouter:fusion" }
    ]
  }'
```

## Reference
- https://x.com/OpenRouter/status/2065856853989270011