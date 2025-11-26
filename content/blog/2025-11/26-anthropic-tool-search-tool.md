---
title: Anthropic's Tool Search Tool
url: blog/anthropic-tool-search-tool
tags:
  - anthropic
  - tools
status: published
date: 2025-11-26T00:00:00.000Z
qblog_id: 4a3c2e0f-b08e-4b9a-b068-1d72cbe73897
---

One of the problem with MCP is that it pollutes the context window with so many token that might be irrelevant to the task that youre doing 

Anthropic has came up with new approach using which their LLM can **discover tools on demand**

Their AI model only sees the tools that it want.

## How to use it?

During tool defn you need to define it.

```json
{
  "tools": [
    // Include a tool search tool (regex, BM25, or custom)
    {"type": "tool_search_tool_regex_20251119", "name": "tool_search_tool_regex"},

    // Mark tools for on-demand discovery
    {
      "name": "github.createPullRequest",
      "description": "Create a pull request",
      "input_schema": {...},
      "defer_loading": true
    }
    // ... hundreds more deferred tools with defer_loading: true
  ]
}
```

Similarly for MCP also you can define it.

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-drive",
  "default_config": {"defer_loading": true}, # defer loading the entire server
  "configs": {
    "search_files": {
"defer_loading": false
    }  // Keep most used tool loaded
  }
}
```