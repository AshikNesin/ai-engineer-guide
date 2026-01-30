---
title: How to do Domain Filter in OpenAI Web Search Tool
url: blog/domain-filter-openai-web-search-tool
tags:
  - openai
  - web-scraping
status: published
date: 2025-09-04T00:00:00.000Z
qblog_id: dca70f66-3fbc-48e0-8ce4-be882ea745dc
---

OpenAI finally has support for domain-level filtering in their [web search tool](/blog/openai-web-search-tool/)

You need to pass in `filters.allowed_domains` when defining the tools

```bash
curl --location 'https://api.openai.com/v1/responses' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $OPENAI_API_KEY' \
--data '{
    "model": "gpt-4.1",
    "tools": [
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "aiengineerguide.com"
                ]
            }
        }
    ],
    "tool_choice": "auto",
    "include": [
        "web_search_call.action.sources"
    ],
    "input": "Does OpenAI supports web hooks?"
}'
```

<details>
  <summary>API Response</summary>
  
  ```json
  {
    "id": "resp_68b9d3df211c8194b6cbc683251cd36704b34dcdfxxxxxxx",
    "object": "response",
    "created_at": 1757008863,
    "status": "completed",
    "background": false,
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "max_tool_calls": null,
    "model": "gpt-4.1-2025-04-14",
    "output": [
        {
            "id": "ws_68b9d3e090108194bf4755ceb505f4fa04b34dcdfxxxxxxx",
            "type": "web_search_call",
            "status": "completed",
            "action": {
                "type": "search",
                "query": "Does OpenAI support webhooks",
                "sources": [
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-webhooks/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-background-mode/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openrouter-web-search/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openrouter-ai-gateway/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/practical-guide-to-building-agents-openai/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-chatgpt-5-system-prompt/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-web-search-tool/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-deep-research-api/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-operator-prompt/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/til/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/use-mcp-react-hook/"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-background-mode/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openrouter-web-search/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openrouter-ai-gateway/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/practical-guide-to-building-agents-openai/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-chatgpt-5-system-prompt/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-web-search-tool/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-deep-research-api/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/openai-operator-prompt/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/til/?utm_source=openai"
                    },
                    {
                        "type": "url",
                        "url": "https://aiengineerguide.com/blog/use-mcp-react-hook/?utm_source=openai"
                    }
                ]
            }
        },
        {
            "id": "msg_68b9d3e3d93c81948114706ff70507b904b34dcdfxxxxxxx",
            "type": "message",
            "status": "completed",
            "content": [
                {
                    "type": "output_text",
                    "annotations": [
                        {
                            "type": "url_citation",
                            "end_index": 499,
                            "start_index": 407,
                            "title": "Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently",
                            "url": "https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 804,
                            "start_index": 712,
                            "title": "Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently",
                            "url": "https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 1307,
                            "start_index": 1215,
                            "title": "Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently",
                            "url": "https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 1711,
                            "start_index": 1619,
                            "title": "Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently",
                            "url": "https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 2105,
                            "start_index": 2013,
                            "title": "Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently",
                            "url": "https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai"
                        },
                        {
                            "type": "url_citation",
                            "end_index": 2611,
                            "start_index": 2519,
                            "title": "Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently",
                            "url": "https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai"
                        }
                    ],
                    "logprobs": [],
                    "text": "According to aiengineerguide.com, OpenAI **does** support webhooks—specifically for handling asynchronous operations like long-running tasks and background processes.\n\nHere are the details:\n\n- OpenAI released webhook support for their **Deep Research API**, enabling notifications when:\n  - A background response is generated\n  - Batch jobs complete\n  - Fine-tuning tasks finish\n  - Evaluation runs end  \n  ([aiengineerguide.com](https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai))\n\n- You can configure webhook endpoints per project via the OpenAI dashboard. After setting it up, you’ll receive a **signing secret** used to verify that incoming webhook requests genuinely originate from OpenAI ([aiengineerguide.com](https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai)).\n\n- Supported event types include:\n  - Batches: `batch.completed`, `batch.failed`, `batch.expired`, `batch.cancelled`\n  - Background responses: `response.completed`, `response.failed`, `response.cancelled`, `response.incomplete`\n  - Fine-tuning jobs: `fine_tuning.job.succeeded`, `fine_tuning.job.failed`, `fine_tuning.job.cancelled`\n  - Eval runs: `eval.run.succeeded`, `eval.run.failed`, `eval.run.canceled` ([aiengineerguide.com](https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai))\n\n- The webhook payload includes headers like `webhook-id`, `webhook-timestamp`, and `webhook-signature`, alongside a JSON body with event details. You must respond with a **2xx HTTP status code** quickly to acknowledge receipt, otherwise OpenAI will retry delivery with exponential backoff (for up to 72 hours) ([aiengineerguide.com](https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai)).\n\n- To verify webhook signatures, you can use the OpenAI SDK or standard webhook libraries. The SDK provides a method like:\n  \n  ```js\n  const event = client.webhooks.unwrap(req.body, req.headers, { secret: webhook_secret });\n  ```\n  \n  —which will throw or raise an error if the signature is invalid ([aiengineerguide.com](https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai)).\n\n---\n\n**In summary**:\nYes—OpenAI supports webhooks, allowing you to receive real-time notifications for events such as background response completion, batch job status updates, fine-tuning progress, and evaluation results. Webhooks are project-specific, secure via signing secrets, require quick 2xx acknowledgments, and are supported via their SDK for easy signature validation—according to aiengineerguide.com ([aiengineerguide.com](https://aiengineerguide.com/blog/openai-webhooks/?utm_source=openai)).\n\nLet me know if you'd like a deeper dive into implementation examples or best practices!"
                }
            ],
            "role": "assistant"
        }
    ],
    "parallel_tool_calls": true,
    "previous_response_id": null,
    "prompt_cache_key": null,
    "reasoning": {
        "effort": null,
        "summary": null
    },
    "safety_identifier": null,
    "service_tier": "default",
    "store": true,
    "temperature": 1.0,
    "text": {
        "format": {
            "type": "text"
        },
        "verbosity": "medium"
    },
    "tool_choice": "auto",
    "tools": [
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "aiengineerguide.com"
                ]
            },
            "search_context_size": "medium",
            "user_location": {
                "type": "approximate",
                "city": null,
                "country": "US",
                "region": null,
                "timezone": null
            }
        }
    ],
    "top_logprobs": 0,
    "top_p": 1.0,
    "truncation": "disabled",
    "usage": {
        "input_tokens": 17088,
        "input_tokens_details": {
            "cached_tokens": 0
        },
        "output_tokens": 584,
        "output_tokens_details": {
            "reasoning_tokens": 0
        },
        "total_tokens": 17672
    },
    "user": null,
    "metadata": {}
}
  
  ```
  </details>

This feature is really helpful for those who are building some sort of Q&A bot based on public content like blogs or websites. Instead of building a RAG pipeline ourselves, we can just get the data on demand.

But beware of the cost if you need this feature at scale.

## Reference
- [https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses&lang=curl#domain-filtering](https://platform.openai.com/docs/guides/tools-web-search?api-mode=responses&lang=curl#domain-filtering)

Happy building with-AI!