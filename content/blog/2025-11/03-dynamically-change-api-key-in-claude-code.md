---
title: How to Dynamically Change Anthropic API Key in Claude Code
url: blog/dynamically-change-api-key-in-claude-code
tags:
  - claude-code
status: published
date: 2025-11-03T00:00:00.000Z
qblog_id: 92be154f-ff24-4ee6-b086-e00921d27bb0
---

There might cases in which you might not be able to set a static `ANTHROPIC_API_KEY` key and use Claude Code.

For example, your company might require you to rotate the key every 1 hour or so.

Claude Code has support for that using `apiKeyHelper`

## What does apiKeyHelper setting does?
When `apiKeyHelper` setting is configured, it'll run shell script and expect an API key as an output from it.

And that key will be used for `X-Api-Key` and `Authorization: Bearer` headers when making LLM request.

## Reference
- [Claude Code settings - Claude Docs](https://docs.claude.com/en/docs/claude-code/settings)