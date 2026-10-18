---
title: DeepSeek Search Tool
url: til/deepseek-search-tool
tags:
  - deepseek
  - search-api
status: published
date: 2026-10-18T00:00:00.000Z
qblog_id: 792dec2a-6bfa-43bf-a34e-0b089eea9337
---

DeepSeek has launched web search tool which costs $0.75/1000 request.

It cheaper than the competitors like Exa.

Failed calls, timeouts and empty results are excluded from billing.

And count can go up to 50 (no extra charges) and you can get content as well using `need_content` param

## How to use it?
```shell
curl https://api.deepseek.com/v1/tools/search \
  -H "Authorization: Bearer <DeepSeek API Key>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest deepseek release",
    "count": 5,
    "need_content": true
  }'
```

https://api-docs.deepseek.com/guides/search/