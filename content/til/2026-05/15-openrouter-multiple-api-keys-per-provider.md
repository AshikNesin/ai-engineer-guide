---
title: OpenRouter now supports multiple API keys per provider
url: til/openrouter-multiple-api-keys-per-provider
tags:
  - openrouter
status: published
date: 2026-05-15T00:00:00.000Z
qblog_id: 5c1b7ea3-62ba-4600-9c26-5dff074931a9
---

OpenRouter now supports multiple keys from the same provider.

This helps in various cases like:
- Handling account level rate limits
- Seperating dev and prod credentials - so your prod doesn't goes down 😅

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/klr0i8pr6xeemvfrbbrv)

And also you can filter the key for a particular models or specific OpenRouter API key or an user.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/uaxf9edkfqyi7stus3ai)


## Reference
- https://openrouter.ai/docs/guides/overview/auth/byok
- https://x.com/OpenRouter/status/2055305259287801865