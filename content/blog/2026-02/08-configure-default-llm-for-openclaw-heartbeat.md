---
title: How to Configure Different (Cheap) LLM for OpenClaw’s Heartbeat
url: blog/configure-default-llm-for-openclaw-heartbeat
tags:
  - openclaw
status: published
date: 2026-02-08T00:00:00.000Z
qblog_id: e48e2813-1d0b-4be0-af81-b592ff21dae7
---

By using faster + cheaper model for OpenClaw heartbeat, we can save the performance and also LLM cost. 

Yeah, you don't need your powerful LLM for that use case.

You can configure different LLM for heartbeat by adding the configuration at `openclaw.json` file.

```json
{
	"agents": {
		"defaults": {
			"heartbeat": {
				"model": "google/gemini-3-flash",
				"every": "30m"
			}
		}
	}
}
```

## Reference
- [I Cut My OpenClaw (ClawdBot) Costs by 90% | OpenClaw + Kimi K2.5 + Optimizations - YouTube](https://www.youtube.com/watch?v=YY1qFOlsGxo)