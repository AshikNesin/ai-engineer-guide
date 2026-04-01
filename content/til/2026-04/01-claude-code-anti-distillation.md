---
title: Claude Code's Anti-distillation System
url: til/claude-code-anti-distillation
tags:
  - claude-code
status: published
date: 2026-04-01T00:00:00.000Z
qblog_id: 3c4ba2d1-83e4-437a-b051-2330a0f4bd76
---

One of the interesting learning from recent [Claude Code source code leak](https://aiengineerguide.com/til/claude-code-source-code-leak/) is how they were handling distillation attempts. 

> Anthropic built two anti-distillation systems into Claude Code to stop competitors from training on its data
> One injects fake tool calls into the model's output stream to corrupt any scraped training data
> Another strips all tool call details into vague summaries so competitors can't reconstruct what the agent actually did

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/wsourfb4yxjv8m8dxwbf)


![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/dngw1ahlid5i3kq107dy)

## Reference
- https://x.com/sahilypatel/status/2039004352367689891