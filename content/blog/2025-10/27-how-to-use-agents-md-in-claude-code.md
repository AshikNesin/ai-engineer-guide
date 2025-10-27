---
title: How to use AGENTS.md in Claude Code
url: blog/how-to-use-agents-md-in-claude-code
tags:
  - claude-code
status: published
date: 2025-10-27T00:00:00.000Z
qblog_id: ae1b33d9-7f1f-442d-b3a6-917e24fcfdff
---

[AGENTS.md](https://agents.md/) is a open started for setting context for AI agents (think of README for the AI agents)

A typical AGENTS.md file will be something like this 👇

![2025-10-27-at-20.33.382x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/dbnkdqzlaigid0lb8lii)

And it has first class support in almost all popular AI IDEs/coding agents like Cursor, Zed, GitHub Copilot, etc
![2025-10-27-at-20.30.572x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/qemth9fwqbyuev3mtoug)

## How to reference it in Claude Code?
Although it is not supported by default in Claude Code. 

We can still add refer it in `CLAUDE.md` to guide Claude Code to refer to our AGENTS.md like this.

```md
@AGENTS.md
```
By doing so we maintain a single source of truth - `AGENTS.md`
## Reference
- [Claude Code on the web - Claude Docs](https://docs.claude.com/en/docs/claude-code/claude-code-on-the-web#best-practices)

Happy adding LLM-context!