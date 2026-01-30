---
title: How to use xAI's Grok Code Fast 1 API for free
url: blog/free-xai-grok-code-fast-1-api
tags:
  - xai
  - vercel
  - ai-gateway
status: published
date: 2025-08-31T00:00:00.000Z
qblog_id: e718aaf1-ee6d-4cdf-b822-974fd7999f71
---

xAI's Grok Code Fast (which was called Sonic in stealth mode) is model that is specifically built for **autonomous  development (coding)** 

With Vercel's [AI Gateway](https://aiengineerguide.com/blog/vercel-ai-gateway/) free credit of $5 per month (if you haven't bought any paid credit in that account).

We can use that model for free using that credit.

![2025-08-28-at-00.13.492x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/lhqgiktlmg6dw6qvh3n7)

## How to get started?
Get your API key for AI Gateway from your Vercel Dashboard.

Once you have the key, you can set the base URL and API key in an SDK that supports OpenAI, or you can directly interact with it via cURL.

| Setting   | Value                               | Notes                                               |
|-----------|-------------------------------------|-----------------------------------------------------|
| baseURL   | [https://ai-gateway.vercel.sh/v1](https://ai-gateway.vercel.sh/v1)   | Use this as the API base URL                        |
| apiKey    | `$AI_GATEWAY_API_KEY`               | Replace `AI_GATEWAY_API_KEY` with your actual key   |

## Example
### cURL

```bash
curl -X POST "https://ai-gateway.vercel.sh/v1/chat/completions" \
-H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model": "xai/grok-code-fast-1",
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
  model='xai/grok-code-fast-1',
  messages=[
    {
      'role': 'user',
      'content': 'Why is the sky blue?'
    }
  ]
)
```

## Reference
[https://docs.x.ai/docs/models/grok-code-fast-1](https://docs.x.ai/docs/models/grok-code-fast-1)

Happy building-with AI!