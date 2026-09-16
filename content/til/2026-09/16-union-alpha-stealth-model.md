---
title: Union Alpha stealth model on OpenRouter
url: til/union-alpha-stealth-model
tags:
  - stealth-model
status: published
date: 2026-09-16T00:00:00.000Z
qblog_id: 2b8a7ae7-7c81-4694-b182-2693df70cc40
---

Usually the model providers gives model inference for free during their alpha period however they will use you prompts for their further training.

But this time that is not the case. 

Union Alpha which is available in openrouter, opencode, etc is just giving away the inference without any catch. They don't trun on your data as well.

- It's a **multimodel** and it claims to be good in agente coding and workflows
- **256k context window**.
- Pricing and other things an not announced yet 

And this might be from the Chinese lab as well

## How to use it in OpenRouter?

```shell
curl -N https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
  "model": "stealth/union-alpha",
  "stream": true,
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}'
```

## References
- https://openrouter.ai/stealth/union-alpha
