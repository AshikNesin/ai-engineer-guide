---
title: How to use OpenAI's GPT-5 API for free
url: blog/free-openai-gpt-5-api
tags:
  - openai
  - vercel
  - ai-gateway
status: published
date: 2025-08-27T00:00:00.000Z
qblog_id: fbfe0889-d298-475a-a95f-d35a537d4b28
---

Vercel's [AI Gateway](https://aiengineerguide.com/blog/vercel-ai-gateway/) is a unified interface for interacting with multiple LLMs across different providers. 

Right now, you can get access to more than 150+ LLM models from them.

Apparently, they're providing $5 per month free credit which you can use to try any LLM model including OpenAI's GPT-5.5

![2025-08-28-at-00.13.492x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/lhqgiktlmg6dw6qvh3n7)

## How to get started?
Get your API key for AI Gateway from your Vercel Dashboard..

Once you have the key, you can set the base URL and API key in an SDK that supports OpenAI, or you can directly interact with it via cURL.L

| Setting   | Value                               | Notes                                               |
|-----------|-------------------------------------|-----------------------------------------------------|
| baseURL   | `https://ai-gateway.vercel.sh/v1`   | Use this as the API base URL                        |
| apiKey    | `$AI_GATEWAY_API_KEY`               | Replace `AI_GATEWAY_API_KEY` with your actual key   |

## Example
```bash
curl -X POST "https://ai-gateway.vercel.sh/v1/chat/completions" \
-H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model": "openai/gpt-5",
  "messages": [
    {
      "role": "user",
      "content": "Why is the sky blue?"
    }
  ],
  "stream": false
}'

```

Happy building-with AI!