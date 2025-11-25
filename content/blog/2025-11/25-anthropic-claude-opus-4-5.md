---
title: Anthropic Claude Opus 4.5
url: blog/anthropic-claude-opus-4-5
tags:
  - anthropic
  - claude-opus-4-5
status: published
date: 2025-11-25T00:00:00.000Z
qblog_id: 5eec892f-a869-4fc3-ad98-5f6a0182ca4c
---

Anthropic has released their latest version of Opus model **Claude Opus 4.5** which now available via API, Claude Code & on AI IDEs like Cursor.

In general Opus models tend to be good model but quite expensive but this time Anthropic has reduced the pricing. Maybe due to competition but it is the most expensive model though😅

| Model | Input ($/million tokens) | Output ($/million tokens) |
|-------|--------------------------|---------------------------|
| Opus 4.5 | $5 | $25 |
| Opus 4 | $15 | $75 |
| GPT-5.1 family | $1.25 | $10 |
| Gemini 3 Pro | $2 | $12 |
| Gemini 3 Pro (>200K tokens) | $4 | $18 |
| Sonnet 4.5 | $3 | $15 |
| Haiku 4.5 | $1 | $5 |

And the model id is `claude-opus-4-5-20251101`

As per their benchmark (if you believe in them), it is powerful one amount all the recent coding models.  

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/p821jbxqngmb57etcejc)

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/uf9ksxaz3ih0zm7eglpu)

## Key Highlights
### 1. Effort Parameter
Similar to OpenAI's effort parameter, you can now configure the `effort` for the particular task. 

Depending on the use case, you can take the tradeoff between speed v/s accuracy.

![2025-11-25-at-22.44.582x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/gg6zoevoox1canjh7ygw)

👉 [Effort - Claude Docs](https://platform.claude.com/docs/en/build-with-claude/effort)

**Example:**
```shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
``` 

### 2. Computer Use Improvements
They've added support for zooming. This helps to build better UI elements.

### 3. Thinking block preservation
Aparently, thinking block was not preserved in context for previous models. Now has support for it.

## Reference
https://www.anthropic.com/news/claude-opus-4-5