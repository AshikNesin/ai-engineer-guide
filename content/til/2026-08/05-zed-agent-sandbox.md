---
title: Zed's Agent sandboxes
url: til/zed-agent-sandbox
tags:
  - zed
status: published
date: 2026-08-05T00:00:00.000Z
qblog_id: 01ef4a7c-ca68-48cb-b401-2940e8bc1feb
---

Zed's Agent now supports sandbox for it's AI Agents. It'll be enabled by default for `terminal` and `fetch` tools.

It prevents the following:
- Prevent agent from editing outside the project
- modifying `.git`
- Or any other network request unless we grant permission.

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-08/fgarbld9nifctaalfygf.mp4" >}}

Similar to other coding agents like Claude Code, it uses Seatbelt on macOs, Bubblewrap on linux, WSL on Windows, etc.

## Reference
- https://zed.dev/blog/sandboxing