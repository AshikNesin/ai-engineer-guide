---
title: Notes on Agent Design Is Still Hard
url: blog/notes-on-agent-design-is-still-hard
tags:
  - bookmark
  - armin-ronacher
status: published
date: 2025-11-24T00:00:00.000Z
qblog_id: 53d732e8-7db3-4f73-aaf9-3d587bc54ce1
---

Armin has written an interesting blog post about why building agents are still hard.

Some of the key highlights:
- Building an AI Agent is still hard. SDK abstractions breaking down when working on a real world problem 😅
- Prefer using SDK from OpenAI or different AI provider than using higher-level abstractions to have a better control over caching, tool integration, and error handling
 - > Testing and evaluation remain the hardest unsolved problems due to the agentic nature requiring full system instrumentation rather than simple prompt testing

## Reference
👉 https://lucumr.pocoo.org/2025/11/21/agents-are-hard/