---
title: How to use Anthropic's Opus 4.1 API for free
url: blog/free-anthropic-opus-4-1-api
tags:
  - anthropic
  - vercel
  - ai-gateway
status: published
date: 2025-08-30T00:00:00.000Z
qblog_id: e32d3bbb-0822-445f-8c51-939aca967a9f
---

Vercel's [AI Gateway](https://aiengineerguide.com/blog/vercel-ai-gateway/) lets you use multiple LLMs across different AI providers just by changing a single line.

Right now, they're giving $5 per month in free credit (if you haven't bought any paid credit in that account), which you can use to try any LLM model including **Anthropic's Opus 4.1**

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
  "model": "anthropic/claude-opus-4.1",
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
  model='anthropic/claude-opus-4.1',
  messages=[
    {
      'role': 'user',
      'content': 'Why is the sky blue?'
    }
  ]
)
```

Happy building-with AI!