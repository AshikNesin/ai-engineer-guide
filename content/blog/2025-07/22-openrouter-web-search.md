---
title: Turn Any LLM into a Web Search Model in OpenRouter
date: 2025-07-22
description: 
tags:
  - openrouter
  - TIL
url: blog/openrouter-web-search
via_url:
---
LLM models out of box does not have support for real time data. 

However top AI providers like OpenAI and Anthropic started providing [web search as a tool](/blog/openai-web-search-tool/) using which you can get real time data.

Similar to that, if you're using OpenRouter you can have such capability for **any** LLM model

## How to do it?

Just suffix the model name with `:online` like `openai/gpt-4o:online`

That's pretty much it.

This functionality is powered by [Exa.ai](https://exa.ai) and uses their [auto](https://docs.exa.ai/reference/how-exa-search-works#combining-neural-and-keyword-the-best-of-both-worlds-through-exa-auto-search) mode (keyword search and embeddings-based web search).
## Response
We'll be getting response in [OpenAI Chat Completion Message type](https://platform.openai.com/docs/api-reference/chat/object) schema

Something like

```json
{
  "message": {
    "role": "assistant",
    "content": "Here's the latest news I found: ...",
    "annotations": [
      {
        "type": "url_citation",
        "url_citation": {
          "url": "https://www.example.com/web-search-result",
          "title": "Title of the web search result",
          "content": "Content of the web search result", // Added by OpenRouter if available
          "start_index": 100, // The index of the first character of the URL citation in the message.
          "end_index": 200 // The index of the last character of the URL citation in the message.
        }
      }
    ]
  }
}
```

## Pricing
This feature uses your OpenRouter credits and charges _$4 per 1000 results_ in addition to LLM 
usage.

By default, `max_results` are set to `5` (max of  $0.02 per request)

## Configuration
You can customize the behaviour by passing in `plugins` when making LLM call.

```json
{
  "model": "openai/gpt-4o:online",
  "plugins": [
    {
      "id": "web",
      "max_results": 1, // Defaults to 5
      "search_prompt": "Some relevant web results:" // See default below
    }
  ]
}

```

## Credits
- [Web Search - OpenRouter ](https://openrouter.ai/docs/features/web-search)

Happy building apps!