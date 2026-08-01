---
title: How to configure Auto Compaction in Pi Coding Agent
url: til/auto-compaction-pi
tags:
  - pi
status: published
date: 2026-08-01T00:00:00.000Z
qblog_id: 185e2541-ed53-44eb-bca1-51bf36e9f0bf
---

We have full control of when the auto compaction happens in [Pi](https://pi.dev) coding agent.

In the settings, we can configure `reserveTokens` and `keepRecentTokens` to tune our compation behaviour

```
# ~/.pi/agent/settings.json
"reserveTokens": 16384
"keepRecentTokens": 20000
```

Trigger: **tokens > window - reserveTokens**

## Reference
- https://x.com/pidotdev/status/2083515588551577926