---
title: How to use Claude Code with z.ai GLM-4.6
url: blog/claude-code-z-ai-glm-4-6
tags:
  - glm-4-6
  - claude-code
status: published
date: 2025-10-08T00:00:00.000Z
qblog_id: 29bcf11e-a36b-46ed-911e-b8bce6600770
---

Z.AI has recently released [GLM-4.6](https://docs.z.ai/guides/llm/glm-4.6) - a open source model that performs as good as Anthropic Sonnet 4 based on the benchmark.

Similar to [GLM-4.5](/blog/claude-code-z-ai-glm-4-5/), you can use it with Claude Code as well.

They offer [GLM Code Plan](https://go.nesin.io/glm), using which you can buy subscription instead of usage based billing as well.

![2025-10-08-at-23.49.062x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/qtyfhwjlsvenr07lywi3)

## How to do it?
Just set these environment variables before running Claude Code cli

```
export ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
export ANTHROPIC_AUTH_TOKEN=YOUR_Z_AI_API
```

Once that is done, you can just start claude code

```
claude
```
## How to get API Key?
Go to https://z.ai/model-api

Login with you z.ai account (same as z.ai chat account) and from there you can get the API key.

Happy claude coding!