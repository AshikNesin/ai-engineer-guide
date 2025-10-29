---
title: What's new in Cursor 2.0?
url: blog/cursor-2-0
tags:
  - cursor
status: published
date: 2025-10-29T00:00:00.000Z
qblog_id: e015da6b-acb0-4a72-8995-12cd251f3610
---

Cursor has released v2.0 today with pretty interesting features.

Here are some highlights

## Voice Mode
Built-in speech-to-text conversion 🎤

{{< video "https://cdn.sanity.io/files/2hv88549/production/f1ccc6dc28be339c8c3697af9be9779f8d60e5b2.mp4"  >}}

## Browser
In the early version, the browser is more of headless. But now they've preview, devtools, etc.

You can select a element and chat with it.

{{< video "https://cdn.sanity.io/files/2hv88549/production/0e795515f844148c8902c79ac41241b6d53b3e86.mp4"  >}}

IDE like Windsurf, Trae, etc has this feature for quite sometime. But it's good support for this in cursor itself.

## Code Review UI
They've improved their code review UI.
{{< video "https://cdn.sanity.io/files/2hv88549/production/a6d569bdda67f7c349f8d343614406ca796769d9.mp4"  >}}

## Sandbox Terminal
Agent commands runs in a sandbox (on macOS)

In macOS, it uses `sandbox-exec` (similar to how it is handled in Claude Code or Codex)

Shell commands that are not already in allow list will automatically run with **read/write access to your workspace and no internet access** 

They've seperate [doc](https://cursor.com/docs/agent/terminal#sandboxing-beta) about it if you're curious about it.

## Composer - Their own AI model
Recently you might have noticed Cheetah model that was performing good enough but super fast.

This is the next iteration of that model.

## Parallel Agents
You can run a single prompt across 8 different AI model in parallel. 

This might be useful when you need more accuracy and ready to burn some money 🤑

## Others
- Run Plan model with one model and build mode with another model.
- Improved prompt UI - They've removed explict context declaration like @Web, @Recent Changes, @Link, @Linter Errors, etc. And claim that agents can self-gather the context without needing to be explict.
- Sharable team commands
- Performance improvements 😅 

## Reference
- [New Coding Model and Agent Interface · Cursor](https://cursor.com/changelog/2-0)