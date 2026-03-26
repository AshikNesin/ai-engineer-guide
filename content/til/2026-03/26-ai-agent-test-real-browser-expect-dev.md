---
title: How to Make AI Agents Test Your Web App Automatically with Expect
url: til/ai-agent-test-real-browser-expect-dev
tags:
  - bookmark
status: published
date: 2026-03-26T00:00:00.000Z
qblog_id: b562095b-6b36-4468-afa5-5fff1e4d91f5
---

[Expect](https://expect.dev) lets you to test your web app automatically with the help of AI agents.

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-03/uppdbtjjq7q1mz5j7fvg.mp4" >}}

## How it works?
- We use Codex/Claude Code to do QA
- It'll write the needed test cases and record of video of every bug that it has found and report back to you.
- Once you've fixed it, you can run it again

## How to get started?

```shell
npx -y expect-cli@latest init
```
