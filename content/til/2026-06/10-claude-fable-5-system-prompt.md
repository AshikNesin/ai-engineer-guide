---
title: Anthropic Claude Fable 5 - System Prompt
url: til/claude-fable-5-system-prompt
tags:
  - anthropic
  - system-prompt
status: published
date: 2026-06-10T00:00:00.000Z
qblog_id: 68ddb9ef-bef8-46aa-badf-79b638729f6a
---

[Pliny the Liberator 🐉󠅫󠄼󠄿󠅆󠄵󠄐󠅀󠄼󠄹󠄾󠅉󠅭](https://x.com/elder_plinius) has posted the entire system prompt for Anthropic's latest (and powerful) model [Claude Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5).

It has massive **~120,000 characters** 😮

## Highlights
- Claude Fable 5 is also a "Mythos-class" but it is publicly available with **extra safety measures**. And Claude Mythos 5 is available to only to approved organizations
- Artifacts now support a key-value storage system
```js
await window.storage.set('key', value, shared?);
await window.storage.get('key');
await window.storage.list('prefix:');
```
- MCP App Trigger logic
  - It must search the MCP registry first before calling any third-party tool
- Copyright Compliance
> **COPYRIGHT HARD LIMITS - APPLY TO EVERY RESPONSE:**
> - 15+ words from any single source is a SEVERE VIOLATION
> - ONE quote per source MAXIMUM—after one quote, that source is CLOSED
> - DEFAULT to paraphrasing; quotes should be rare exceptions
> These limits are NON-NEGOTIABLE. See the copyright compliance section for full rules.

- File handling

>CRITICAL - FILE LOCATIONS:
> 1. USER UPLOADS (files the user mentions): every file in context is also on disk at `/mnt/user-data/uploads`. `view /mnt/user-data/uploads` to list.
> 2. CLAUDE'S WORK: `/home/claude`. Create all new files here first. Users can't see this directory; use it as a scratchpad.
> 3. FINAL OUTPUTS: `/mnt/user-data/outputs`. Copy completed files here; it's how the user sees Claude's work. ONLY final deliverables (including code files). For simple single-file tasks (<100 lines), write directly here.


## Full System Prompt

<iframe frameborder="0" scrolling="no" style="width:100%; height:46064px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2Felder-plinius%2FCL4R1T4S%2Fblob%2Fmain%2FANTHROPIC%2FCLAUDE-FABLE-5.md&style=default&type=markdown&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></iframe>

## Reference
- https://x.com/elder_plinius/status/2064478648057610422
- https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md