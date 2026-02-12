---
title: How to use GLM-5 in Claude Code
url: blog/glm-5-in-claude-code
tags:
  - claude-code
  - glm-5
  - glm-coding-plan
status: published
date: 2026-02-12T00:00:00.000Z
qblog_id: 0dd3df7d-5ab3-4713-8dc9-d266e74d9394
---

The latest model from z.ai - GLM-5 just got release. As per the benchmark it is as good as Anthropic Opus 4.5.

Even though there is no official annoncement yet, you can access it via [API](https://aiengineerguide.com/blog/glm-5-coding-plan-api/)

And so, we can use it in Claude Code as well.

Once you've installed Claude Code. You need to modify the `~/.claude/settings.json` file

```json
{
	"env": {
		"ANTHROPIC_AUTH_TOKEN": "your_zai_api_key",
		"ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
		"API_TIMEOUT_MS": "3000000",
		"ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
		"ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5",
		"ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5"

	}
}
```
## Reference
- https://docs.z.ai/devpack/tool/claude#manual-configuration