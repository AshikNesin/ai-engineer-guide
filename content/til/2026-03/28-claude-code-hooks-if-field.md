---
title: How to use conditional hooks in Claude Code
url: til/claude-code-hooks-if-field
tags:
  - claude-code
status: published
date: 2026-03-28T00:00:00.000Z
qblog_id: 84b08e04-42cd-4137-8ba5-b53ab7e959bb
---

Claude Code now has support for conditional `if` field in hooks. It uses the [permission rule syntax](https://code.claude.com/docs/en/permissions#wildcard-patterns) like `Edit`, `Read`, etc

For example, you can run the hook only for specific file pattern like formatting Javascript codes like these

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/ffrnwg4bwdp13puopxqy)

Or running a specific commands only for `git` like this

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/vo1etjcbaryrlxgtex3g)

## Reference
- https://x.com/lydiahallie/status/2037573738670297583