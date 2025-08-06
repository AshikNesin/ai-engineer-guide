---
title: How to use OpenAI’s gpt-oss models in Groq
date: 2025-08-06
description: 
tags:
  - gpt-oss
  - groq
url: blog/groq-openai-gpt-oss
via_url:
---
OpenAI's open model LLM [gpt-oss](https://openai.com/index/introducing-gpt-oss/) are available in [Groq](https://groq.com/)

Both the 20b and 120b parameters are supported as well.

| AI Model            | Current Speed (Tokens per Second) | Input Token Price (Per Million Tokens) | Output Token Price (Per Million Tokens) |
|---------------------|-----------------------------------|----------------------------------------|-----------------------------------------|
| GPT OSS 20B 128k    | 1,000                             | $0.10 (10M / $1)*                      | $0.50 (2M / $1)*                         |
| GPT OSS 120B 128k   | 500                               | $0.15 (6.67M / $1)*                    | $0.75 (1.33M / $1)*                      |

## Usage

Replace `GROQ_API_KEY` with your API key.

```bash
curl "https://api.groq.com/openai/v1/chat/completions" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${GROQ_API_KEY}" \
  -d '{
         "messages": [
           {
             "role": "user",
             "content": ""
           }
         ],
         "model": "openai/gpt-oss-120b",
         "temperature": 1,
         "max_completion_tokens": 8192,
         "top_p": 1,
         "stream": true,
         "reasoning_effort": "medium",
         "stop": null
       }'
  
```

For sdk code snippets you can refer to it in the API playground in Groq

Happy faster inference