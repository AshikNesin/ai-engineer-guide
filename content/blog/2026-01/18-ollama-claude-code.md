---
title: How to use any Ollama AI model with Claude Code
url: blog/ollama-claude-code
tags:
  - ollama
  - claude-code
  - open-responses
status: published
date: 2026-01-18T00:00:00.000Z
qblog_id: 076378bf-82a0-4a97-9a85-2a76d5f5ace3
---

Ollama now has [Anthropic like API compatibility](https://docs.ollama.com/api/anthropic-compatibility) which means you can use any models (open source models) that is available in Ollama (both local & cloud) with Claude Code

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/u2uzgrxpvhqinn2g7svg)

## How to use it?
Just set these env variables and start Claude Code

```shell
export ANTHROPIC_AUTH_TOKEN=ollama  # required but ignored
export ANTHROPIC_BASE_URL=http://localhost:11434
export ANTHROPIC_API_KEY=ollama  # required but ignored
```

Then you can start claude like this

```shell
claude --model qwen3-coder
```

Replace `qwen3-coder` with the model that you want to use.

In case of Ollama cloud based model, you can do like this

```shell
claude --model glm-4.7:cloud
```

Ollama recommends the following models

| Local Models       | Cloud Models        |
|--------------------|---------------------|
| gpt-oss:20b        | glm-4.7:cloud       |
| qwen3-coder        | minimax-m2.1:cloud  |

## How does it work?
Under the hood, they parse and transform the API schema so that it is compatable with Anthropic API.

They're following [Open Response API](https://www.openresponses.org/) standard.

You can even use this with Anthropic SDK as well

```py
import anthropic

client = anthropic.Anthropic(
    base_url='http://localhost:11434',
    api_key='ollama',
)

message = client.messages.create(
    model='qwen3-coder',
    tools=[
        {
            'name': 'get_weather',
            'description': 'Get the current weather in a location',
            'input_schema': {
                'type': 'object',
                'properties': {
                    'location': {
                        'type': 'string',
                        'description': 'The city and state, e.g. San Francisco, CA'
                    }
                },
                'required': ['location']
            }
        }
    ],
    messages=[{'role': 'user', 'content': "What's the weather in San Francisco?"}]
)

for block in message.content:
    if block.type == 'tool_use':
        print(f'Tool: {block.name}')
        print(f'Input: {block.input}')
```

## Reference
https://ollama.com/blog/claude
https://x.com/ollama/status/2012434308091224534