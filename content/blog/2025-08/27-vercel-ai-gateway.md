---
title: Vercel's AI Gateway
url: blog/vercel-ai-gateway
tags:
  - openai
  - vercel
  - ai-gateway
status: published
date: 2025-08-27T00:00:00.000Z
qblog_id: 07041ca9-f614-4326-8ef3-8a20ee5220be
---

Vercel has recently launched their AI Gateway using which you can interact with multiple LLM (more than 100+) with just a single line of code change.

This is similar to OpenRouter's AI gateway but Vercel does not charge 5% markup like how OpenRouter is charging.

And you get all the features like Observability, Bring Your Own Key, etc

## Model Support
They support wide range of models including latest Anthropic and OpenAI models like GPT-5
And there is no specific rate limiting for those models as well.
![2025-08-27-at-00.08.172x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/okak7nq3h3o9rcnnlpy6)

https://vercel.com/ai-gateway/models

As you might have noticed, you just need to change **model** to something like `xai/grok-4` or `anthropic/claude-sonnet-4` to use different models.
![2025-08-27-at-23.40.102x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/tjmybgi0gypkx1pvfecn)

![2025-08-27-at-23.40.312x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/afxq1no5gisqngxxtlha)

## API Format
And yeah, you don't need to worry about provider specific API request/response format. They'll tranform it to [OpenAI-Compatible API](https://vercel.com/docs/ai-gateway/openai-compat)

## How to get started?
Just get the **API Key** from your Vercel Dashboard.
![2025-08-26-at-22.43.282x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/sfpaixajkarzgcuina1t)

![2025-08-27-at-23.31.352x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/flfs4fkzivwixrevprf1)

That's pretty much it. 

Now use it in Vercel's AI SDK or any other SDK that supports OpenAI format.

## Example
Here are some of the examples on how to use it.

### Vercel's AI SDK
```js
import { streamText } from 'ai'

const result = streamText({
  model: 'openai/gpt-5',
  prompt: 'Why is the sky blue?'
})
```

### OpenAI SDK - Python

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

### cURL

```shell
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

### Your favorite tool/Library
As long as your app/tool/library supports OpenAI like API, you can use this AI gateway in it.

Just set baseURL as `https://ai-gateway.vercel.sh/v1`

And `apiKey` as `$AI_GATEWAY_API_KEY`

Make sure to replace `AI_GATEWAY_API_KEY` with your API key.

## Free Credits
Currently, Vercel provides $5 free credits per month (as long as you don't add any credits in Vercel's AI Gateway)

And you can use that credit for virtually anything

## Reference
- https://vercel.com/docs/ai-gateway/getting-started

Happy building AI!