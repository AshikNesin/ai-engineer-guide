---
title: How to use Anthropic's Sonnet 4 API for free
url: blog/free-anthropic-sonnet-4-api
tags:
  - anthropic
  - vercel
  - ai-gateway
  - sonnet-4
status: published
date: 2025-08-29T00:00:00.000Z
qblog_id: d60af334-783b-48e7-9d43-6851eb4a266c
---

Vercel's [AI Gateway](https://aiengineerguide.com/blog/vercel-ai-gateway/) lets you use multiple LLMs across different AI providers just by changing a single line.

Right now, they're giving $5 per month in free credit (if you haven't bought any paid credit in that account), which you can use to try any LLM model including Anthropic's Sonnet 4

![2025-08-28-at-00.13.492x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/lhqgiktlmg6dw6qvh3n7)

## How to get started?
Get your API key for AI Gateway from your Vercel Dashboard.

Once you have the key, you can set the base URL and API key in an SDK that supports OpenAI, or you can directly interact with it via cURL.

| Setting   | Value                               | Notes                                               |
|-----------|-------------------------------------|-----------------------------------------------------|
| baseURL   | `https://ai-gateway.vercel.sh/v1`   | Use this as the API base URL                        |
| apiKey    | `$AI_GATEWAY_API_KEY`               | Replace `AI_GATEWAY_API_KEY` with your actual key   |

## Example
### cURL

```bash
curl -X POST "https://ai-gateway.vercel.sh/v1/chat/completions" \
-H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model": "anthropic/claude-sonnet-4",
  "messages": [
    {
      "role": "user",
      "content": "Why is the sky blue?"
    }
  ],
  "stream": false
}'
```
### OpenAI SDK

```python
import os
from openai import OpenAI

client = OpenAI(
  api_key=os.getenv('AI_GATEWAY_API_KEY'),
  base_url='https://ai-gateway.vercel.sh/v1'
)

response = client.chat.completions.create(
  model='anthropic/claude-sonnet-4',
  messages=[
    {
      'role': 'user',
      'content': 'Why is the sky blue?'
    }
  ]
)
```

Happy building-with AI!