---
title: OpenAI's GPT-5 Codex
url: til/openai-gpt-5-codex
tags:
  - openai
status: published
date: 2025-09-24T00:00:00.000Z
qblog_id: 149e93a5-c7c0-47dc-9614-6751be34c328
---

GPT‑5-Codex is a version of GPT‑5 LLM that is built specifically for **agentic and interactive coding tasks**

OpenAI recommends using GPT-5-Codex only for **agentic and interactive coding** use cases.

![2025-09-24-at-23.45.282x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/qyntgbte05wiirsb6lye)

Here is what they've claimed in their launch blog post👇
> It’s trained on complex, real-world engineering tasks such as building full projects from scratch, adding features and tests, debugging, performing large-scale refactors, and conducting code reviews. It’s more steerable, adheres better to AGENTS.md⁠(opens in a new window) instructions, and produces higher-quality code—just tell it what you need without writing long instructions on style or code cleanliness.

They've recently started providing inference via API. 

Things to keep in mind:
- It is available only in Responses API
- And it does not provide verbosity parameter.

## How to get started?
You can start using this by setting the model id as `gpt-5-codex`

```shell
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5-codex",
    "input": "Tell me a three sentence bedtime story about a unicorn."
  }'

```

## References
- https://openai.com/index/introducing-upgrades-to-codex/
- https://platform.openai.com/docs/models/gpt-5-codex