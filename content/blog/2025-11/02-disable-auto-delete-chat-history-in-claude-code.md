---
title: How to disable Auto-Delete of Chat History in Claude Code
url: blog/disable-auto-delete-chat-history-in-claude-code
tags:
  - claude-code
status: published
date: 2025-11-02T00:00:00.000Z
qblog_id: ee649466-92c0-4b0c-bda0-14fce60eb61d
---

Apparently, Claude Code **auto deletes** chat history/session after 30 days by default.

However, you can configure this behaviour by setting `cleanupPeriodDays` in your `~/.claude/settings.json` config file.

```json
{
  "cleanupPeriodDays": 99999
}
```

There is no boolean option to disable it but by setting the above day, we delay it by 274 years 😅 

## Reference
- [Claude Code settings - Claude Docs](https://docs.claude.com/en/docs/claude-code/settings#available-settings)
- [Don't let Claude Code delete your session logs](https://simonwillison.net/2025/Oct/22/claude-code-logs/#atom-everything)