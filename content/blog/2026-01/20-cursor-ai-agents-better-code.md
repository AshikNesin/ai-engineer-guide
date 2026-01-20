---
title: Using Cursor’s AI Coding Agents for Better Code
url: blog/cursor-ai-agents-better-code
tags:
  - cursor
status: published
date: 2026-01-20T00:00:00.000Z
qblog_id: 7375a6d5-9466-4d2e-938b-2fe59df391c9
---

Almost a year ago, AI models was struglging to do basic tool calling now it can build an entire app from scratch with just a single prompt.

It's up to us to leverage the AI model by using it effectively.

Here are some tips by Cursor team on how to leverage AI to build apps.

## 1. Use Planning
Before starting anything, use `Plan Mode` to plan what you are going to build and then iterate over it until it covers your use case as expected then execute it.

In Cursor, you can press `Shift + Tab` to toggle the modes.

Plans are nothing but a markdown file which we can edit directly as well.

Tip: Click "Save to workspace" to store plans in .cursor/plans directory which can be used to resume the work and act as context for future enhancements for the same feature.

Here are some of the other tips by Cursor founder - Michael Truell
- Let Cursor search on its own, don't over-tag context
- Use tests as the feedback loop (TDD + iterate until green)
- When it goes sideways: revert → tighten the plan → rerun
- Keep long chats short; use @ Past Chats for continuity
- Add lightweight .cursor/rules for recurring mistakes
- Use skills + hooks for long-running "grind until tests pass" loops
- Run multiple agents/models in parallel via worktrees

## Reference
- https://cursor.com/blog/agent-best-practices