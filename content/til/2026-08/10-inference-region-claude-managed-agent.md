---
title: Inference region in Claude Managed Agent
url: til/inference-region-claude-managed-agent
tags:
  - bookmark
status: published
date: 2026-08-10T00:00:00.000Z
qblog_id: 966a2092-e8b7-46ac-8299-f33a974edb2f
---

If your use case requires data residency requirement and you're using claude managed agent, you can configure the inference region by passing `model.inference_geo`

Right now it supports `global` (default) and `us` region.

But if you're using custom region then you'll get billing 1.1x though which you need to be mindful of.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-08/vdok9ghxp6o6rlfv4gmi)

## Reference
- https://x.com/ClaudeDevs/status/2085853171294101699