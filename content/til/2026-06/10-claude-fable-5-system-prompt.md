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
  
## Full System Prompt

<iframe frameborder="0" scrolling="no" style="width:100%; height:46064px;" allow="clipboard-write" src="https://emgithub.com/iframe.html?target=https%3A%2F%2Fgithub.com%2Felder-plinius%2FCL4R1T4S%2Fblob%2Fmain%2FANTHROPIC%2FCLAUDE-FABLE-5.md&style=default&type=markdown&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></iframe>

## Reference
- https://x.com/elder_plinius/status/2064478648057610422
- https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/CLAUDE-FABLE-5.md