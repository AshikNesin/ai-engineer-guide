---
title: AgentsView - Local-First AI Coding Session Viewer
url: til/agentsview-ai-coding-session-viewer
tags:
  - tools
status: published
date: 2026-06-11T00:00:00.000Z
qblog_id: 0106444a-f73d-4d8b-9b79-45169b520e0e
---

[AgentsView](https://www.agentsview.io/) is a open source tool that reads the AI sessions on your machine that is created by AI Agents like Claude Code, Codex, Pi, etc.

Instead of the messy JSONL files, you get a a web UI using which you can browse, search and analyze them.
_
![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/ssorumbsnrdo9qjlugeg)

## How to get started?

You can install it using brew
```shell
brew install --cask agentsview
```

And then run 

```shell
agentsview serve
```

It'll start the server at `http://127.0.0.1:8080`