---
title: How to set Multiple System Prompts with Anthropic's Claude API
url: blog/multiple-system-prompts-with-anthropic-api
status: published
date: 2026-01-09T00:00:00.000Z
qblog_id: b4107a9e-4aee-4272-b924-4895ed520536
---

Sometime you might want to send multiple system prompts when making API request to Anthropic LLM like Sonnet 4.5 or Opus 4.5.

![2026-01-09-at-23.13.102x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/vtg6gobildls1yc8knig)

You can just pass it as array of string or array of text block and pass it to **system** like this

```shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      { "type": "text", "text": "You are a helpful assistant." },
      { "type": "text", "text": "Always respond in JSON format." }
    ],
    "messages": [
      { "role": "user", "content": "What is an API?" }
    ]
  }'
```

Unlike OpenAI, Anthropic messages API does not have support for "system" role in input messages. We need to send them seperately under "system"

## Reference
[https://platform.claude.com/docs/en/api/messages/create](https://platform.claude.com/docs/en/api/messages/create)