---
title: How to use Kimi K2.6 for free with Cloudflare Worker AI
url: til/kimi-k2-6-cloudflare-worker-ai
tags:
  - cloudflare
  - kimi-k2-6
status: published
date: 2026-04-21T00:00:00.000Z
qblog_id: b5f0b5ef-e8d4-43d3-b10b-34c9e3173f90
---

Kimi K2.6 from Moonshot AI is the latest open source model that is on par with Opus 4.6 (Max) mode based on the benchmarks.

It is available in [Cloudflare Worker AI](https://www.cloudflare.com/en-in/developer-platform/products/workers-ai/) which you can use it for free. Probably for your personal projects, the limit might be sufficient.

We'll be using Cloudflare's [AI Gateway](https://developers.cloudflare.com/ai-gateway/) who takes care of the request/response transformation, etc so that we can just use it with any SDK like OpenAI's SDK or Anthropic's SDK.

Let's first create a new AI gateway

![2026-04-21-at-20.33.48.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/fdctjfq4jla21kab0mpu)

Make sure to configure the auth. You can turn on logging, caching, rate limiting based on your needs :)

![2026-04-21-at-20.37.54.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/dls6zxpq6maxwvlfxndc)

In the code samples select "Unified API" and "Worker AI"

![2026-04-21-at-20.39.16.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/ssptlkcjurtvhnnjuepk)

And here you go. Just replace the `$CF_AIG_TOKEN` token with the token that you've created.

Now you should be able to access any models that is available in Cloudflare Workers AI.

```shell
curl -X POST https://gateway.ai.cloudflare.com/v1/$CF_ACCOUNT_ID/nesin-ai/compat/chat/completions \
  --header "cf-aig-authorization: Bearer $CF_AIG_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "workers-ai/@cf/moonshotai/kimi-k2.6",
    "messages": [
      {
        "role": "user",
        "content": "Why sky is blue?"
      }
    ]
  }'
```

```json
{"id":"id-1776784307643","object":"chat.completion","created":1776784307,"model":"@cf/moonshotai/kimi-k2.6","choices":[{"finish_reason":"stop","index":0,"logprobs":null,"matched_stop":163586,"message":{"content":"The sky is blue because of a phenomenon called **Rayleigh scattering**.\n\nHere is the step-by-step explanation:\n\n1.  **Sunlight is white, but it’s a mix of colors.** White light from the sun is made up of all the colors of the rainbow, each with different wavelengths. ..... By the time the light reaches you, nearly all the blue and green light has been scattered away, leaving mostly the longer red and orange wavelengths.","reasoning_content":"The user is asking a classic science question: \"Why is the sky blue?\" I need to provide a clear, accurate explanation of Rayleigh scattering that is accessible but scientifically correct.\n\nKey points to cover:\n1. Sunlight appears white but is made of all colors (wavelengths) of the visible spectrum\n2.  ...... \nTone should be helpful and educational.","role":"assistant","tool_calls":null}}],"usage":{"prompt_tokens":13,"completion_tokens":791,"total_tokens":804,"prompt_tokens_details":{"cached_tokens":3}}}
```

And their dashboard to view the logs and other metrics is so clean as well.
![2026-04-21-at-20.53.02.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/gu04qwe0w03ticnuhgpk)

![2026-04-21-at-20.55.42.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/oqe0jee1eprxbwsme2vg)
