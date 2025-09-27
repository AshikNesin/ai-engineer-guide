---
title: GitHub Copilot CLI - A Claude Code Alternative?
url: blog/github-copilot-cli
tags:
  - cli-agent
  - github-copilot
status: published
date: 2025-09-26T00:00:00.000Z
qblog_id: c93adfea-6acc-40f6-801e-9c5b7a94d0bb
---

Another day, another agentic cli 😅

GitHub Copilot has released their coding agent like Claude Code in public beta.

👉 https://github.blog/changelog/2025-09-25-github-copilot-cli-is-now-in-public-preview/

Right now, it is pretty basic version though don't expect much from it though and it has the usual stuffs like MCP

![2025-09-26-at-23.49.522x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/ul85kks2upms3gqmm0rq)

## How to get started?
You can install this from npm

```shell
npm install -g @github/copilot
```

Once you've installed it, login with your GitHub account.

And start using it like how you use Claude Code or other agentic CLI.

## Heads up!
It comes with GitHub MCP by default (and currently you can't disable it 🙈) - So it just eats away your available context forcefully.