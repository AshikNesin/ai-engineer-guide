---
title: How to use Claude Code with Kimi K2
url: blog/claude-code-kimi-k2
tags:
  - claude-code
  - kimi-k2
status: published
date: 2025-07-16T00:00:00.000Z
description: null
qblog_id: bd89c181-5434-45df-b0f8-9a510097ec1e
via_url: null
---

[Kimi K2](https://moonshotai.github.io/Kimi-K2/) model which was released recently by Moon shot AI recently had Deepseak moment.

It's the open source non-thinking model that is scoring good in online benchmarks

![2025-07-16 at 14.04.59@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-16-at-14.04.59-at-2x.png)

You can think of this similar to Anthropic Claude 3.5

Token usage adds up fast for AI agents so for the task that requires **less intelligence** you can consider using models like Kimi K2 especially if you're using agentic tools like Claude code.

You can get their hosted version directly from them or using Open Router / Groq

Their hosted version is 80% times cheaper than Anthropic.
## How to do it?

Just set these environment variables before running Claude Code cli

```shell
export ANTHROPIC_AUTH_TOKEN=YOUR_MOONSHOT_API
export ANTHROPIC_BASE_URL=https://api.moonshot.ai/anthropic
```

And now, you can start claude code as usual

```shell
claude
```

Happy cost optimization!
