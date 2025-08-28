---
title: How to use OpenAI's GPT-5 API for free
url: blog/free-openai-gpt-5-api
tags:
  - openai
  - vercel
  - ai-gateway
status: published
date: 2025-08-28T00:00:00.000Z
qblog_id: fbfe0889-d298-475a-a95f-d35a537d4b28
---

Vercel's [AI Gateway](https://aiengineerguide.com/blog/vercel-ai-gateway/) is a unified interface for interacting with multiple LLMs across different providers. 

Right now, you can get access to more than 150+ LLM models from them.

Apparently, they're providing $5 per month free credit which you can use to try any LLM model including OpenAI's GPT-5 

![2025-08-28-at-00.13.492x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/lhqgiktlmg6dw6qvh3n7)

## How to get started?
Get your API key for AI Gateway from your Vercel Dashboard..

Once you have the key, you can set the base URL and API key in an SDK that supports OpenAI, or you can directly interact with it via cURL.

| Setting   | Value                               | Notes                                               |
|-----------|-------------------------------------|-----------------------------------------------------|
| baseURL   | `https://ai-gateway.vercel.sh/v1`   | Use this as the API base URL                        |
| apiKey    | `$AI_GATEWAY_API_KEY`               | Replace `AI_GATEWAY_API_KEY` with API Key  |

## Supported GPT 5 Models
Currently these are the GPT-5 family models that are supported in Vercel AI Gateway

| Model Name    | Model ID             | Context | Input Tokens | Output Tokens | Cache Read | Good At |
|---------------|----------------------|---------|--------------|---------------|------------|--------------------|
| **GPT-5**     | openai/gpt-5         | 400K    | $1.25/M      | $10.00/M      | $0.13/M    | Complex reasoning, broad real-world knowledge, code-intensive, and multi-step agentic tasks |
| **GPT-5 nano**| openai/gpt-5-nano    | 400K    | $0.05/M      | $0.40/M       | $0.01/M    | High throughput, excels at simple instruction or classification tasks |
| **GPT-5 mini**| openai/gpt-5-mini    | 400K    | $0.25/M      | $2.00/M       | $0.03/M    | Cost optimized, excels at reasoning/chat tasks with balance of speed, cost, and capability |

## Example

### cURL

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

### OpenAI SDK

```python
import os
from openai import OpenAI

client = OpenAI(
  api_key=os.getenv('AI_GATEWAY_API_KEY'),
  base_url='https://ai-gateway.vercel.sh/v1'
)

response = client.chat.completions.create(
  model='openai/gpt-5',
  messages=[
    {
      'role': 'user',
      'content': 'Why is the sky blue?'
    }
  ]
)
```

Replace the model id with whatever model that you want to use.

Happy building-with AI!