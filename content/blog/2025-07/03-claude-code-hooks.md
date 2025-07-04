---
title: How to Add Custom Hooks in Claude Code
date: 2025-07-03
description: 
tags:
  - TIL
  - claude-code
  - bookmark
url: blog/claude-code-hooks
via_url:
---
Claude Code now supports **custom hooks**  🌟

## What are hooks?
This feature allows us to register **shell commands** during Claude Code’s lifecycle.

A good analogy would be it is something similar to Git hooks. 

It provides **deterministic control** over Claude Code’s behavior instead of relying on the LLM

For example, running automated code formatting whenever a file is changed.

And here are some of the other use cases that are mentioned in their docs

![CleanShot 2025-07-04 at 07.44.43@2x.png](/images/CleanShot-2025-07-04-at-07.44.43-at-2x.png)

## How to get started?
Anthropic has a detailed doc about how to configure, test, examples, etc.

Checkout their docs for more details on this 👉 http://docs.anthropic.com/en/docs/claude-code/hooks

Happy wiring hooks!