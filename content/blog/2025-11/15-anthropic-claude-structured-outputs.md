---
title: Anthropic Ships Guaranteed Structured Outputs for Claude Sonnet 4.5 & Opus 4.1
url: blog/anthropic-claude-structured-outputs
tags:
  - anthropic
  - sonnet-4-5
  - opus-4-1
status: published
date: 2025-11-15T00:00:00.000Z
qblog_id: 0c8bb824-3c04-4b7f-abdf-1c0087ead1c3
---

Anthropic's latest AI models - Sonnet 4.5 & Opus 4.1 now supports **guaranteed structured outputs**

This means that whatever schema that we define, we'll get response in the same format. 

Earlier, we had to handle it in consumer end and if there is an error we had to do lot of back and forth API calls to get it fixed.

Now the heavy lifting is done by LLM.

## What's the benefit of using it?
- Always type safe.
- No more schema violations.
- Two modes
 - JSON - for tasks like data extraction
 - Strict tool use - for complex tools and agentic workflows

## How to use it?

Just define `output_format.type` as `json_schema` or  `"strict": true` inside tool declaration.

```shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
   "messages": [
      {
        "role": "user",
        "content": "My name is John and I am 28 years old."
      }
    ],
    "output_format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "age": {"type": "number"}
        },
        "required": ["name", "age"]
      }
    }
  }'
```

And we'll be getting response like this

Response format: Valid JSON matching your schema in response.content[0].text

```json
{
  "name": "John",
  "age": 28
}
```

## Reference
- https://docs.claude.com/en/docs/build-with-claude/structured-outputs

Happy parsing content!