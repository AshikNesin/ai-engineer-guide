---
title: How to disable Git Co-Author Attribution in Claude Code
url: blog/disable-co-author-in-claude-code
tags:
  - claude-code
status: published
date: 2025-09-21T00:00:00.000Z
qblog_id: dcf99b9a-a820-4a03-ab8f-d25a7b8201a0
---

By default, if you commit code using Claude Code, then it adds **co-authored-by Claude** in those commits.

If you prefer not to have those in attributions, you can just disable it using `settings.json`

In MacOS/Linux, you can find it at `~/.claude/settings.json`

There, set **includeCoAuthoredBy** to false like this

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/ujmamabgp6aaomoxulkv)

That's pretty much it.

## Reference
- [Claude Code settings - Claude Docs](https://docs.claude.com/en/docs/claude-code/settings#available-settings)
- [https://x.com/screenfluent/status/1969649160237252819](https://x.com/screenfluent/status/1969649160237252819)

Happy clean commits!