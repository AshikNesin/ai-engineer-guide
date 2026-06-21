---
title: How to use GLM-5.2 in Claude Code via Vercel AI Gateway
url: til/vercel-ai-gateway-glm-5-2-claude-code
tags:
  - claude-code
  - vercel
status: published
date: 2026-06-21T00:00:00.000Z
qblog_id: c572a750-d39c-4e3b-95b1-5925aab737a2
---

If you wanted to try out GLM 5.2 model but which is hosted on US region, then [Vercel AI Gateway](https://vercel.com/ai-gateway/models/glm-5.2) might be a good choice.

You can pretty easily use [any model from Vercel AI gateway](https://aiengineerguide.com/til/vercel-ai-gateway-with-claude-code/) via Claude Code as well.

In our case, we'll be using GLM 5.2

```shell
export ANTHROPIC_BASE_URL="https://ai-gateway.vercel.sh"
export ANTHROPIC_AUTH_TOKEN="your-ai-gateway-api-key"
# You need to set ANTHROPIC_API_KEY as empty
export ANTHROPIC_API_KEY=""

export ANTHROPIC_DEFAULT_SONNET_MODEL="zai/glm-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="zai/glm-5.2"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="zai/glm-5-turbo"
```

## Reference
- https://vercel.com/docs/ai-gateway/coding-agents/claude-code