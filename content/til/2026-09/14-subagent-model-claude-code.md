---
title: How to configure sub-agent model in Claude Code
url: til/subagent-model-claude-code
tags:
  - claude-code
status: published
date: 2026-09-14T00:00:00.000Z
qblog_id: da20653f-becd-4bed-8f98-9430823553d2
---

Claude Code let's you to customize the sub-agent model. This is especially useful if you're using some powerful model like Fabel 5.1

You can just do it by setting the env variable

```shell
CLAUDE_CODE_SUBAGENT_MODEL=opus
```

By setting this, any new sub-agents that spawns will use that configured model instead.

## Reference
https://x.com/lydiahallie/status/2099195114115707210