---
title: OpenAI Web Search Tool via API
date: 2025-06-10
description: 
tags:
  - OpenAI
url: blog/openai-web-search-tool
via_url:
---

Similar to [Anthropic](https://aiengineerguide.com/blog/anthropic-claude-web-search-tool/), OpenAI also provides [web search tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tooll). This tools gets executed at their server during LLM inference.  

## What does web search tool does?
As the name suggest, it can search the internet real-time and use the content for generating response. By doing so it overcomes the core limitation of LLMs -- getting up to date information beyond knowledge cutoff date. And it indirectly increases the accuracy rate.

## Quick Example

When making the API request, we need to define the following tool in the tools array

### Tool definition

```json
{ 
	"type": "web_search_preview",
	"search_context_size":"medium" // "high" or ""
	// Optional: Localize search results 
	"user_location": { 
		"type": "approximate", 
		"city": "Chennai", 
		"region": "Tamil Nadu", 
		"country": "IN", 
		"timezone": "Asia/Kolkata" 
	}
}
```

| **Feature**         | **Details**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Localization**    | Use the `user_location` parameter to localize search results. <br><br>**Supported Fields:**<br>• `type`: Must be `approximate`<br>• `city`: City name<br>• `region`: State or region<br>• `country`: Country<br>• `timezone`: [IANA timezone ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                                                                                                                                                                                                                                                                                                         |
| Search context size | Use `search_context_size` to control how much web info the tool uses to build a response.<br><br>**Impact on:**  <br>• **Cost:** Higher context size = higher price  <br>• **Quality:** Higher context size = richer, more accurate answers  <br>• **Latency:** Higher context size = slower response<br><br>**Available values:**  <br>• `high`: Most comprehensive, highest cost, slowest response  <br>• `medium` (default): Balanced cost, quality, and speed  <br>• `low`: Least context, lowest cost, fastest, but potentially lower quality<br><br>Note: Tokens used in search don’t count against the main model’s token limit and aren’t saved between turns. |
> Unlike Anthropic Claude web search tool, it does not have support for domain level filtering
### Request
Here is a simple example:

```sh
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
    "model": "gpt-4.1",
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
    "input": "What is the current repo rate?"
}'
```

Make sure to set you `OPENAI_API_KEY` in header

### Response

```json
{
    "id": "resp_68485a78dc8c81a180deb74eb08e90af0a1bbda4aad14a82",
    "object": "response",
    "created_at": 1749572216,
    "status": "completed",
    "background": false,
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "model": "gpt-4.1-2025-04-14",
    "output": [
        {
            "id": "ws_68485a79f6c081a18785a5d36aa8de340a1bbda4aad14a82",
            "type": "web_search_call",
            "status": "completed"
        },
        {
            "id": "msg_68485a7ba69881a1848e775f4a8d63f00a1bbda4aad14a82",
            "type": "message",
            "status": "completed",
            "content": [
                {
                    "type": "output_text",
                    "annotations": [
                        {
                            "type": "url_citation",
                            "end_index": 234,
                            "start_index": 107,
                            "title": "India slashes interest rates, but who will borrow?",
                            "url": "https://www.reuters.com/world/india/india-slashes-interest-rates-who-will-borrow-2025-06-10/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 562,
                            "start_index": 469,
                            "title": "India cuts rates more than expected to boost economy",
                            "url": "https://www.ft.com/content/9d9ef36b-317a-4aea-affd-f2c96ab46d51?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 789,
                            "start_index": 625,
                            "title": "India slashes interest rates, but who will borrow?",
                            "url": "https://www.reuters.com/world/india/india-slashes-interest-rates-who-will-borrow-2025-06-10/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 929,
                            "start_index": 792,
                            "title": "India cuts rates more than expected to boost economy",
                            "url": "https://www.ft.com/content/9d9ef36b-317a-4aea-affd-f2c96ab46d51?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 1174,
                            "start_index": 932,
                            "title": "Instant View: India central bank delivers outsized 50 bps rate easing, slashes reserve ratio",
                            "url": "https://www.reuters.com/world/india/view-india-central-bank-delivers-outsized-50-bps-rate-easing-lowers-cash-reserve-2025-06-06/?utm_source=openai"
                        }
                    ],
                    "text": "As of June 10, 2025, the Reserve Bank of India (RBI) has reduced the repo rate by 50 basis points to 5.5%. ([reuters.com](https://www.reuters.com/world/india/india-slashes-interest-rates-who-will-borrow-2025-06-10/?utm_source=openai)) This decision aims to stimulate economic growth amid global uncertainties and subdued domestic investment. Additionally, the RBI has lowered the cash reserve ratio by 100 basis points to 3%, enhancing liquidity in the banking system. ([ft.com](https://www.ft.com/content/9d9ef36b-317a-4aea-affd-f2c96ab46d51?utm_source=openai))\n\n\n## RBI Implements Significant Rate Cuts to Boost Economy:\n- [India slashes interest rates, but who will borrow?](https://www.reuters.com/world/india/india-slashes-interest-rates-who-will-borrow-2025-06-10/?utm_source=openai)\n- [India cuts rates more than expected to boost economy](https://www.ft.com/content/9d9ef36b-317a-4aea-affd-f2c96ab46d51?utm_source=openai)\n- [Instant View: India central bank delivers outsized 50 bps rate easing, slashes reserve ratio](https://www.reuters.com/world/india/view-india-central-bank-delivers-outsized-50-bps-rate-easing-lowers-cash-reserve-2025-06-06/?utm_source=openai) "
                }
            ],
            "role": "assistant"
        }
    ],
    "parallel_tool_calls": true,
    "previous_response_id": null,
    "reasoning": {
        "effort": null,
        "summary": null
    },
    "service_tier": "default",
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
    "usage": {
        "input_tokens": 308,
        "input_tokens_details": {
            "cached_tokens": 0
        },
        "output_tokens": 345,
        "output_tokens_details": {
            "reasoning_tokens": 0
        },
        "total_tokens": 653
    },
    "user": null,
    "metadata": {}
}

```


> As of June 10, 2025, the Reserve Bank of India (RBI) has reduced the repo rate by 50 basis points to 5.5% ...

We got the correct RBI repo rate in the response
## How does it work?
1. We need to define the tool in our request
2. OpenAI will determine if web search is needed.
3. If so, it'll search the internet real time (with the preference that you've configured in tool definition)
4. The search result is used for generation

## Token Usage
You will get token usage in API response.

```json
{
	"usage": {
        "input_tokens": 308,
        "input_tokens_details": {
            "cached_tokens": 0
        },
        "output_tokens": 345,
        "output_tokens_details": {
            "reasoning_tokens": 0
        },
        "total_tokens": 653
    }
}
```

## References
- https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses&lang=curl

Happy searching internet!