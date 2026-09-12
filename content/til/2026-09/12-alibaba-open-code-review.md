---
title: Alibaba's Code Review CLI
url: til/alibaba-open-code-review
tags:
  - bookmark
status: published
date: 2026-09-12T00:00:00.000Z
qblog_id: 0998b3ea-6ee7-41f5-a387-7226b07039c9
---

Alibaba has open sourced their AI-powered code review CLI tool that they've been using internally for years. 

> It reads Git diffs, sends changed files to a configurable LLM via an agent with tool-use capabilities, and generates structured review comments with line-level precision. The agent can read full file contents, search the codebase, inspect other changed files for context, and produce deep reviews — not just surface-level diff feedback.

## How to get started?
Install the cli

```shell
npm install -g @alibaba-group/open-code-review
```

then configure the provider & model

```
ocr config provider          # Select a built-in provider or add a custom one
ocr config model             # Pick a model for the active provider
```

Then in your project, in your project you can ask it to review

```shell
ocr review
```

## Reference
https://github.com/alibaba/open-code-review