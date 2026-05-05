---
title: Free Search API for AI Agents with TinyFish
url: til/free-search-api-tinyfish
tags:
  - tools
  - search-api
status: published
date: 2026-05-05T00:00:00.000Z
qblog_id: ffdb36f8-d85d-4b29-a2e9-ca79aab65a67
---

[TinyFish](https://tinyfish.ai) offers various things that you might want to use in your AI application like Browser, web automation, URL fetch and also search endpoint as well.

Now they're offering Search & Fetch API for free on very plan but has a very aggressive rate limiting like `5 req/min` on free plan.

![2026-05-05-at-22.52.42.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/rgljdyxvszpqak6btvgj)

## How to get started?

Just create an account and get the API key

Make the API request with that key

```shell
curl "https://api.search.tinyfish.ai?query=your+query+here&location=US&language=en" \
  -H "X-API-Key: $TINYFISH_API_KEY"
```

You can checkout their docs for more details regarding this
https://docs.tinyfish.ai/search-api

![2026-05-05-at-22.32.10.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/yc7ekwxy51uvfbujim1i)