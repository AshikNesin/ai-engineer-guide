---
title: Using Claude Code SDK to Build Custom Apps
date: 2025-07-29
description: 
tags:
  - TIL
  - claude-code
url: blog/claude-code-sdk
via_url:
---
Claude Code is the agentic coding tool that is really good in writing code.

I've been using it actively for last couple of weeks. And I prefer it over other IDEs like Cursor.

Claude Code provides [SDK](https://docs.anthropic.com/en/docs/claude-code/sdk) which you can use it to build your own custom apps on top of it.

Currently the SDK is available in both Typescript & Python.
## How to get started?

Let's see a quick demo of it in Typescript/Javascript
### Typescript

Make sure you've installed the SDK in your repo

```bash
npm i @anthropic-ai/claude-code
```

And you can just use `query` from the SDK to interact with Claude Code.

```ts
import { query, type SDKMessage } from "@anthropic-ai/claude-code";

const messages: SDKMessage[] = [];

for await (const message of query({
  prompt: "What are the recent posts on AIEngineerGuide.com?",
  abortController: new AbortController(),
  options: {
    maxTurns: 3,
    allowedTools:["WebSearch","WebFetch"]
  },
})) {
  messages.push(message);
}

console.log(JSON.stringify(messages, null, 2));

```

In this example, since I've mentioned the blog name. It went ahead and got the required content from the blog directly.

```json
[
  {
    "type": "system",
    "subtype": "init",
    "cwd": "/Users/ashiknesin/Code/cc-sdk-demo",
    "session_id": "337767bd-1728-4585-9b6e-7ed286452a50",
    "tools": [
      "Task",
      "Bash",
      "Glob",
      "Grep",
      "LS",
      "ExitPlanMode",
      "Read",
      "Edit",
      "MultiEdit",
      "Write",
      "NotebookRead",
      "NotebookEdit",
      "WebFetch",
      "TodoWrite",
      "WebSearch"
    ],
    "mcp_servers": [],
    "model": "claude-sonnet-4-20250514",
    "permissionMode": "default",
    "apiKeySource": "/login managed key"
  },
  {
    "type": "assistant",
    "message": {
      "id": "msg_01YMikDXiddD3KMpkxJmkMv6",
      "type": "message",
      "role": "assistant",
      "model": "claude-sonnet-4-20250514",
      "content": [
        {
          "type": "text",
          "text": "I'll search for recent posts on AIEngineerGuide.com for you."
        }
      ],
      "stop_reason": null,
      "stop_sequence": null,
      "usage": {
        "input_tokens": 3,
        "cache_creation_input_tokens": 376,
        "cache_read_input_tokens": 14061,
        "output_tokens": 8,
        "service_tier": "standard"
      }
    },
    "parent_tool_use_id": null,
    "session_id": "337767bd-1728-4585-9b6e-7ed286452a50"
  },
  {
    "type": "assistant",
    "message": {
      "id": "msg_01YMikDXiddD3KMpkxJmkMv6",
      "type": "message",
      "role": "assistant",
      "model": "claude-sonnet-4-20250514",
      "content": [
        {
          "type": "tool_use",
          "id": "toolu_01Ve75Mv6hUHu2N5DPkdkvAK",
          "name": "WebFetch",
          "input": {
            "url": "https://AIEngineerGuide.com",
            "prompt": "What are the most recent blog posts or articles on this website? Please list the titles, dates if available, and brief descriptions of the recent content."
          }
        }
      ],
      "stop_reason": "tool_use",
      "stop_sequence": null,
      "usage": {
        "input_tokens": 3,
        "cache_creation_input_tokens": 376,
        "cache_read_input_tokens": 14061,
        "output_tokens": 126,
        "service_tier": "standard"
      }
    },
    "parent_tool_use_id": null,
    "session_id": "337767bd-1728-4585-9b6e-7ed286452a50"
  },
  {
    "type": "user",
    "message": {
      "role": "user",
      "content": [
        {
          "tool_use_id": "toolu_01Ve75Mv6hUHu2N5DPkdkvAK",
          "type": "tool_result",
          "content": "Based on the content, here are the recent blog posts:\n\n1. \"How to use Claude Code Sub Agents\" (July 28, 2025)\n2. \"How to use Gemini CLI within Claude Code\" (July 27, 2025)\n3. \"Behind the Scenes: How Anthropic teams uses Claude Code\" (July 26, 2025)\n4. \"How to Search GitHub Public Repo with Grep MCP\" (July 25, 2025)\n5. \"How to use Claude Code with Qwen3 Coder\" (July 24, 2025)\n\nThe posts appear to focus on AI coding tools, development techniques, and exploring different AI coding platforms and methodologies. No detailed descriptions are provided in the source text beyond the titles."
        }
      ]
    },
    "parent_tool_use_id": null,
    "session_id": "337767bd-1728-4585-9b6e-7ed286452a50"
  },
  {
    "type": "assistant",
    "message": {
      "id": "msg_01KvRSgF6a7B6kfdcnzcvojT",
      "type": "message",
      "role": "assistant",
      "model": "claude-sonnet-4-20250514",
      "content": [
        {
          "type": "text",
          "text": "Here are the recent posts from AIEngineerGuide.com:\n\n1. **\"How to use Claude Code Sub Agents\"** (July 28, 2025)\n2. **\"How to use Gemini CLI within Claude Code\"** (July 27, 2025)\n3. **\"Behind the Scenes: How Anthropic teams uses Claude Code\"** (July 26, 2025)\n4. **\"How to Search GitHub Public Repo with Grep MCP\"** (July 25, 2025)\n5. **\"How to use Claude Code with Qwen3 Coder\"** (July 24, 2025)\n\nAll posts focus on AI coding tools and development techniques."
        }
      ],
      "stop_reason": null,
      "stop_sequence": null,
      "usage": {
        "input_tokens": 5,
        "cache_creation_input_tokens": 624,
        "cache_read_input_tokens": 14437,
        "output_tokens": 167,
        "service_tier": "standard"
      }
    },
    "parent_tool_use_id": null,
    "session_id": "337767bd-1728-4585-9b6e-7ed286452a50"
  },
  {
    "type": "result",
    "subtype": "success",
    "is_error": false,
    "duration_ms": 12344,
    "duration_api_ms": 11251,
    "num_turns": 4,
    "result": "Here are the recent posts from AIEngineerGuide.com:\n\n1. **\"How to use Claude Code Sub Agents\"** (July 28, 2025)\n2. **\"How to use Gemini CLI within Claude Code\"** (July 27, 2025)\n3. **\"Behind the Scenes: How Anthropic teams uses Claude Code\"** (July 26, 2025)\n4. **\"How to Search GitHub Public Repo with Grep MCP\"** (July 25, 2025)\n5. **\"How to use Claude Code with Qwen3 Coder\"** (July 24, 2025)\n\nAll posts focus on AI coding tools and development techniques.",
    "session_id": "337767bd-1728-4585-9b6e-7ed286452a50",
    "total_cost_usd": 0.019179,
    "usage": {
      "input_tokens": 8,
      "cache_creation_input_tokens": 1000,
      "cache_read_input_tokens": 28498,
      "output_tokens": 302,
      "server_tool_use": {
        "web_search_requests": 0
      },
      "service_tier": "standard"
    }
  }
]
```


### Python
Make sure Claude Code CLI is installed and you've logged in your machine.

`npm install -g @anthropic-ai/claude-code`

Then install the SDK

```py
pip install claude-code-sdk

```

```python
import anyio
from claude_code_sdk import query, ClaudeCodeOptions, Message

async def main():
    messages: list[Message] = []
    
    async for message in query(
        prompt="Write a haiku about foo.py",
        options=ClaudeCodeOptions(max_turns=3)
    ):
        messages.append(message)
    
    print(messages)

anyio.run(main)
```

```
[SystemMessage(subtype='init', data={'type': 'system', 'subtype': 'init', 'cwd': '/Users/ashiknesin/Code/sandbox/cc-sdk', 'session_id': '45cf3f88-00ef-46fa-9c48-513d9d29142c', 'tools': ['Task', 'Bash', 'Glob', 'Grep', 'LS', 'ExitPlanMode', 'Read', 'Edit', 'MultiEdit', 'Write', 'NotebookRead', 'NotebookEdit', 'WebFetch', 'TodoWrite', 'WebSearch'], 'mcp_servers': [], 'model': 'claude-sonnet-4-20250514', 'permissionMode': 'default', 'apiKeySource': '/login managed key'}), AssistantMessage(content=[ToolUseBlock(id='toolu_013hGRPdmUxp9APeuEzcsj2J', name='WebSearch', input={'query': 'Ashik Nesin location based'})]), UserMessage(content=[{'tool_use_id': 'toolu_013hGRPdmUxp9APeuEzcsj2J', 'type': 'tool_result', 'content': 'Web search results for query: "Ashik Nesin location based"\n\nLinks: [{"title":"Ashik Nesin - Software Engineer & Maker","url":"https://ashiknesin.com/"},{"title":"Ashik Nesin - Find Email and Phone Number with AroundDeal","url":"https://www.arounddeal.com/p/ashik-nesin/a9zmrklqvw"},{"title":"Nesin Technologies Llp - Company, Directors, Charges and Compliance details | FileSure","url":"https://www.filesure.in/company/nesin-technologies-llp/AAP-6768?tab=about"},{"title":"User Ashik Nesin - Information Security Stack Exchange","url":"https://security.stackexchange.com/users/210155/ashik-nesin"},{"title":"About - Ashik Nesin","url":"https://ashiknesin.com/about"},{"title":"Ashik Nesin Email address & phone number | Founder for Nesin Technologies Llp - AeroLeads","url":"https://aeroleads.com/in/ashiknesin"},{"title":"About - AshikNesin.com","url":"https://archives.ashiknesin.com/about/"},{"title":"Ashik Nesin / WIP","url":"https://wip.co/@ashiknesin"},{"title":"NESIN TECHNOLOGIES LLP - Company, registration details, products, directors, charges and contact details | Connect2India","url":"https://connect2india.com/NESIN-TECHNOLOGIES-LLP/5681030"},{"title":"Ashik Nesin","url":"https://www.facebook.com/AshikNesin/"}]\n\nBased on the search results, here\'s what I found about Ashik Nesin\'s location:\n\nAshik Nesin is based in Chennai, Tamil Nadu, India. The search results consistently show that he is located in Chennai, Tamil Nadu, India, where he lives and develops.\n\nSome additional context about Ashik Nesin:\n- He\'s a software engineer and maker\n- He works as a Senior Frontend Engineer at Chargebee\n- He\'s also associated with Nesin Technologies LLP, which he co-founded\n- The company is based in Palavanthangal, Chennai, with a registered office address\n\nThe search results clearly establish Chennai, Tamil Nadu, India as Ashik Nesin\'s location.'}]), AssistantMessage(content=[ToolUseBlock(id='toolu_011r6C5tEVhxJpjfyUwp621F', name='WebFetch', input={'url': 'https://ashiknesin.com/about', 'prompt': "Find information about Ashik Nesin's location or where he is based"})]), UserMessage(content=[{'type': 'tool_result', 'content': "Claude requested permissions to use WebFetch, but you haven't granted it yet.", 'is_error': True, 'tool_use_id': 'toolu_011r6C5tEVhxJpjfyUwp621F'}]), AssistantMessage(content=[TextBlock(text='Based on the search results, Ashik Nesin is based in Chennai, Tamil Nadu, India.')]), ResultMessage(subtype='success', duration_ms=19927, duration_api_ms=19498, is_error=False, num_turns=5, session_id='45cf3f88-00ef-46fa-9c48-513d9d29142c', total_cost_usd=0.0719143, usage={'input_tokens': 14, 'cache_creation_input_tokens': 1776, 'cache_read_input_tokens': 44212, 'output_tokens': 206, 'server_tool_use': {'web_search_requests': 0}, 'service_tier': 'standard'}, result='Based on the search results, Ashik Nesin is based in Chennai, Tamil Nadu, India.')]
```

> Based on the search results, Ashik Nesin is based in Chennai, Tamil Nadu, India.

While invoking the query in the SDK, you can also customize it based on your use case

Like configuring maxTurns, allowedTools, etc.

This actually opens up lot of opportunities for use to build tools on top of Claude Code.

But, beware of the token usage as well 😜

Check out the docs to learn more about it.

[Claude Code SDK - Anthropic](https://docs.anthropic.com/en/docs/claude-code/sdk)

Happy building tools!