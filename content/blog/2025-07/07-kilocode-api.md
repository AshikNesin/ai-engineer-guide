---
title: How to use Kilocode LLM API Directly
date: 2025-07-07
description: 
tags:
  - kilocode
url: blog/kilocode-api
via_url:
---
Recently, I was [playing](https://aiengineerguide.com/blog/kilocode-vs-code/) around with [Kilocode](https://kilocode.ai/) which is an AI agent coding extension that you can install in VS Code (and forks like Cursor, Windsurf, etc)

While checking the code base for Kilocode provider it seems like they're using [OpenRouter](https://github.com/Kilo-Org/kilocode/blob/main/src/api/providers/kilocode-openrouter.ts) under the hood.

So essentially, you can **directly invoke API** endpoint like how you would use [OpenRouter API](https://openrouter.ai/docs/api-reference/overview)

Replace `https://openrouter.ai/api/v1` in OpenRouter API endpoint with `https://kilocode.ai/api/openrouter` and pass your API key in the header.

```shell
curl --location 'https://kilocode.ai/api/openrouter/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: $KILOCODE_API_KEY' \
--data '{
    "model": "google/gemini-2.5-flash-preview-05-20",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello"
                }
            ]
        }
    ]
}'
```

## How to get KiloCode API Key?
You can get the KiloCode API from your [dashboard](https://kilocode.ai/profile).

![2025-07-07 at 23.01.13@2x.png](/images/2025-07-07-at-23.01.13-at-2x.png)

Happy AI inference!