---
title: How Claude Code answers question about Claude Code
url: blog/claude-code-docs-map
tags:
  - claude-code
status: published
date: 2025-10-28T00:00:00.000Z
qblog_id: b0a846d9-c2d2-4b55-b832-00a2686d5ec9
---

It is interesting to see how Claude Code refers to it's own internal docs in when you ask a question related to Claude Code.

Basically, they maintain a [claude_code_docs_map.md](https://docs.claude.com/en/docs/claude-code/claude_code_docs_map.md) file which has links to other docs - you can think of it sort of like sitemap with TLDR context.

And uses `WebFetch` tool to further fetch the urls based on that markdown file. Like this 👇

![2025-10-28-at-23.46.012x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/dotyq4l0i0x37issngjz)

And here Claude Code system prompt 👇
> When the user directly asks about Claude Code (eg. "can Claude Code do...", "does Claude Code have..."), or asks in second person (eg. "are you able...", "can you do..."), or asks how to use a specific Claude Code feature (eg. implement a hook, or write a slash command), use the WebFetch tool to gather information to answer the question from Claude Code docs. The list of available docs is available at https://docs.claude.com/en/docs/claude-code/claude_code_docs_map.md.

## Reference
- [claude_code_docs_map.md](https://simonwillison.net/2025/Oct/24/claude-code-docs-map)