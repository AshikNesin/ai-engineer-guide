---
title: Session aware bash tools in Pi Coding Agent
url: til/session-aware-bash-tools-pi
tags:
  - pi
status: published
date: 2026-07-26T00:00:00.000Z
qblog_id: 914d662e-714d-4276-8243-2c38020d50c3
---

Commands (like bash tools) that is running inside [Pi](https://pi.dev) coding agent will be **session-aware**.

They'll set `PI_MODEL`, `PI_PROVIDER`, `PI_REASONING_LEVEL` dynamically.

So your scripts/hooks know those context and change it's behaviour on the fly.

## Reference
- https://x.com/pidotdev/status/2080978871927910695