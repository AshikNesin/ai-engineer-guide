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

You can also customize the tools like this

```json
{
  "tools": [
    {
      "type": "openrouter:fusion",
      "parameters": {
        "analysis_models": [
          "~google/gemini-flash-latest",
          "deepseek/deepseek-v3.2",
          "~moonshotai/kimi-latest"
        ],
        "model": "~anthropic/claude-opus-latest"
      }
    }
  ]
}
```

![2026-06-14-at-23.06.502x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/juayx97rzu8xkrcuwwn0)

And finally we'll getting answer like this
```json
{
  "status": "ok",
  "analysis": {
    "consensus": ["Points all or most panel models agreed on"],
    "contradictions": [
      { "topic": "...", "stances": [{ "model": "...", "stance": "..." }] }
    ],
    "partial_coverage": [
      { "models": ["..."], "point": "Only some models covered this" }
    ],
    "unique_insights": [
      { "model": "...", "insight": "Something only one model raised" }
    ],
    "blind_spots": ["Topics no panel model addressed"]
  },
  "responses": [
    { "model": "anthropic/claude-opus-4.5", "content": "..." },
    { "model": "openai/gpt-4.1", "content": "..." },
    { "model": "google/gemini-2.5-pro", "content": "..." }
  ]
}
```

## Reference
- https://x.com/OpenRouter/status/2065856853989270011