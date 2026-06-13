---
title: How to use GLM-5.2 with Claude Code
url: til/glm-5-2-claude-code
tags:
  - claude-code
  - glm-5-2
status: published
date: 2026-06-13T00:00:00.000Z
qblog_id: 15d0919d-91c8-4c71-83d6-d218d9142c0c
---

Z.ai has released their latest open source model GLM 5.2 which they claim to perform good for coding like Opus 4.7.

It is right now available in GLM Coding Plan. 

And you can use it by setting the required env variables

Though, I prefer to have alias like these which helps me to use official Anthropic models and glm override easily.

```shell
function ccg() {
  local zai_api_key="${ZAI_API_KEY:-your_zai_api_key}"

  ANTHROPIC_AUTH_TOKEN="$zai_api_key" \
  ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic" \
  API_TIMEOUT_MS="3000000" \
  CLAUDE_CODE_AUTO_COMPACT_WINDOW="1000000" \
  ANTHROPIC_DEFAULT_HAIKU_MODEL="glm-4.5-air" \
  ANTHROPIC_DEFAULT_SONNET_MODEL="glm-5.2[1m]" \
  ANTHROPIC_DEFAULT_OPUS_MODEL="glm-5.2[1m]" \
  claude "$@"
}
```

Make sure that you've set `ZAI_API_KEY` env variable before running the it.

## Reference
- https://docs.z.ai/devpack/tool/claude#manual-configuration