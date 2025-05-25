---
title: Vercel v0 LLM API
date: 2025-05-25
description: 
tags:
  - vercel
  - v0
  - bookmark
url: blog/vercel-v0-api
via_url: https://vercel.com/docs/v0/api
---
Vercel has recently announced [v0 LLM API](https://vercel.com/docs/v0/api) - the model which is trained to build web apps.

It looks like this is the older generation model (`v0-1.0-md`) that they've used in their v0.dev app (their current model is named as `v0-1.5-md`)

And it is OpenAI SDK compatible. 

I guess this this model could be their fine tuned or distilled model for their use case.

## Example Snippet

```sh
curl https://api.v0.dev/v1/chat/completions \
  -H "Authorization: Bearer $V0_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "v0-1.0-md",
    "messages": [
      { "role": "user", "content": "Create a Next.js AI chatbot" }
    ]
  }'
```

Theo has recently posted a video about it which is pretty good. 

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/VEByHg_aFPI?si=V_xi3cIeH0_DLlZ-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### References
- [v0 LLM API](https://vercel.com/docs/v0/api)

Happy building apps!