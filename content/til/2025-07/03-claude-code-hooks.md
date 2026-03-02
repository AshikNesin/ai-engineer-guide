---
title: How to Add Custom Hooks in Claude Code
url: til/claude-code-hooks
tags:
  - til
  - claude-code
  - bookmark
status: published
date: 2025-07-03T00:00:00.000Z
description: null
qblog_id: c847826e-d773-4289-b47b-65899e9c8fd0
via_url: https://x.com/alexalbert__/status/1940480961923473610
---

Claude Code now supports **custom hooks**  🌟

## What are hooks?
This feature allows us to register **shell commands** during Claude Code’s lifecycle.

A good analogy would be it is something similar to Git hooks. 

It provides **deterministic control** over Claude Code’s behavior instead of relying on the LLM

For example, running automated code formatting whenever a file is changed.

And here are some of the other use cases that are mentioned in their docs

![CleanShot 2025-07-04 at 07.44.43@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/CleanShot-2025-07-04-at-07.44.43-at-2x.png)

## How to get started?
Anthropic has a detailed doc about how to configure, test, examples, etc.

Checkout their docs for more details on this 👉 http://docs.anthropic.com/en/docs/claude-code/hooks

Happy wiring hooks!
