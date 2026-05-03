---
title: Response Caching in OpenRouter
url: til/response-caching-openrouter
tags:
  - openrouter
status: published
date: 2026-05-03T00:00:00.000Z
qblog_id: ed2abaa5-8ab3-41ec-8035-2a7a100e5602
---

OpenRouter now lets you cache the responses across all the models.

Just add `X-OpenRouter-Cache: true` and it'll cache **chat completions, responses, messages, or embeddings requests**.

First call hits the AI provider and other subsequent requests will return the same response and you **won't** get billed for that.

If you're using LLM in test env, local development and other similar environment. You can just enable this feature and so you don't ended up paying for those use cases.

## How to use it?

```shell
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-OpenRouter-Cache: true" \
  -d '{
    "model": "google/gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Why sky is blue?"}]
  }'
```

## Reference
- https://openrouter.ai/announcements/response-caching