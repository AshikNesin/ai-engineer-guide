---
title: How to Dynamically load MCP in Claude Code to reduce token usage
url: blog/dynamically-load-mcp-in-claude-code
tags:
  - claude-code
status: published
date: 2026-01-06T00:00:00.000Z
qblog_id: 038023cd-501e-4b36-852b-3ed379a4da37
---

In general, using MCP consumes lot of context window because all the tool metadata gets to sent to an LLM during every interaction.

Claude Code has come up with a way to dynamically load the MCP tool if needed.

This feature is currently not officially documented. And mostly a beta feature.

## How to enable it?
Just set `ENABLE_TOOL_SEARCH` to `true`

You can also set it in `~/.claude/settings.json` under `env` object as well.

And just use `claude` command.

You can also check the token usage using `/context` command to see the token usage before and after as well.

## Reference
[https://github.com/anthropics/claude-code/issues/12836](https://github.com/anthropics/claude-code/issues/12836)

[https://x.com/sdrzn/status/2005660540576928074](https://x.com/sdrzn/status/2005660540576928074)