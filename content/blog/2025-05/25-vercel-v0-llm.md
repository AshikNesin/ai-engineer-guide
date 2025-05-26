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
Vercel has recently released [v0 LLM API](https://vercel.com/docs/v0/api) -  which is trained to build web apps and might have been used to power the previous version of [v0.dev](https://v0.dev)

It is [OpenAI Chat Completion](https://platform.openai.com/docs/api-reference/chat) API/SDK compatible which suggest that it might been a fine tuned or distilled version of a OpenAI model.

Here are some of the things that they've mentioned in their docs as features:
- **Framework aware completions** - Obviously, it is trained to respond Next.js
- **Multimodal** - text and image inputs (base64-encoded image data).
- **Quick edit** - Streams inline edits as they’re available.
- Tool calling support
- Optimized for frontend and full-stack web development

## Example Snippet

You can get the key in [v0.dev settings](https://v0.dev/chat/settings/keys)

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

And if you're using [AI SDK](https://ai-sdk.dev/docs/introduction) by Vercel

```sh
npm install ai @ai-sdk/vercel
```

```js
import { generateText } from 'ai';
import { vercel } from '@ai-sdk/vercel';
 
const { text } = await generateText({
  model: vercel('v0-1.0-md'),
  prompt: 'Create a Next.js AI chatbot with authentication',
});
```


Theo has recently posted a video about it which is pretty good. 

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/VEByHg_aFPI?si=V_xi3cIeH0_DLlZ-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### References
- [v0 LLM API](https://vercel.com/docs/v0/api)

Happy building apps!