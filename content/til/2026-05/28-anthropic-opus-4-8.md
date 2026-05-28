---
title: Anthropic Opus 4.8
url: til/anthropic-opus-4-8
tags:
  - anthropic
status: published
date: 2026-05-28T00:00:00.000Z
qblog_id: 20731128-38da-47bf-bd87-af9b49d456bd
---

Anthropic has released their latest LLM model in their Opus family. As per the benchmark it has performed well for majority of the benchmarks when you compare this agaist GPT-5.5 or Gemini 3.1 Pro

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/kng2x7r4xfiookkglfxr)

In terms of pricing 👇

| Mode    | Input Tokens | Output Tokens |
|---------|--------------|---------------|
| Regular | $5 per million | $25 per million |
| Fast    | $10 per million | $50 per million |

And we can use this in Claude API with this id `claude-opus-4-8`


One of the interesting that this model introduce is [**Dynamic workflows**](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code) which can be used to perform long running tasks like migrating large scale code base (maybe, they did Bun migration to rust to promote this feature as well 😅)

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/f2lqlowe5qaorztounlj)

And now **Messages API** supports accepting system entires (metadata) inside the messages array *without breaking prompt cache or routing the update through a user*.

> This can be used in a given harness to update permissions, token budgets, or environment context as an agent runs.

## Reference
- https://www.anthropic.com/news/claude-opus-4-8
