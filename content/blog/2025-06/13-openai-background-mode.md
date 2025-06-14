---
title: Handling Async Inference with OpenAI's API Background mode
date: 2025-06-13
description: 
tags:
  - OpenAI
url: blog/openai-background-mode
via_url:
---
Ever hit an API timeout while waiting for your AI model to finish? 🤔

Well, most of us would when we've to perform complex task like code generation (or when API Agents) and you don't have control over infra to change your settings.

For such cases, OpenAI's [Background mode](https://platform.openai.com/docs/guides/background) does the job really well. 

## How it works?
1. **You make the request**
	 Include `background: true` in your payload to `/v1/responses`.
2. **Receive a Response ID**  
	You’ll immediately get `{ id, status: "queued", ... }`—no output yet.
3. **Poll or Webhook**
		Perform **Poll or Webhook** based on your use case.

## Making a Background Request


### Making API Call
```sh
curl --location 'https://api.openai.com/v1/responses' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $OPENAPI_KEY' \
--data '{
    "model": "gpt-4.1",
    "input": "What is the recent repo rate in India",
    "tools": [
        {
            "type": "web_search_preview",
            "user_location": {
                "type": "approximate",
                "country": "IN",
                "city": "Chennai",
                "region": "Chennai"
            }
        }
    ],
    "background": true
}'
```

And you'll be getting result like this
```json
{
    "id": "resp_684bfb8173d881a18555062f5fe90dbd052475c2a9835116",
    "object": "response",
    "created_at": 1749810049,
    "status": "queued",
    "background": true,
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "model": "gpt-4.1-2025-04-14",
    "output": [],
    "parallel_tool_calls": true,
    "previous_response_id": null,
    "reasoning": {
        "effort": null,
        "summary": null
    },
    "service_tier": "auto",
    "store": true,
    "temperature": 1.0,
    "text": {
        "format": {
            "type": "text"
        }
    },
    "tool_choice": "auto",
    "tools": [
        {
            "type": "web_search_preview",
            "search_context_size": "medium",
            "user_location": {
                "type": "approximate",
                "city": "Chennai",
                "country": "IN",
                "region": "Chennai",
                "timezone": null
            }
        }
    ],
    "top_p": 1.0,
    "truncation": "disabled",
    "usage": null,
    "user": null,
    "metadata": {}
}
```

## Retrieve Your Async Response
Based on the `id` that we've got while making the request. We need to use it to get the response (Obviously!)

```sh
curl https://api.openai.com/v1/responses/resp_YOUR_ID_HERE \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

## References
- https://platform.openai.com/docs/guides/background

Happy background mode!