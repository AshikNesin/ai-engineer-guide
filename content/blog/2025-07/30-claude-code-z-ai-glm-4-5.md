---
title: How to use Claude Code with z.ai GLM-4.5
url: blog/claude-code-z-ai-glm-4-5
tags:
  - claude-code
  - glm-4-5
  - z-ai
status: published
date: 2025-07-30T00:00:00.000Z
description: null
qblog_id: bf60639d-bbb3-4ba7-8c59-12acc0381533
via_url: null
---

Z.AI has released [GLM-4.5](https://z.ai/blog/glm-4.5) which is an open source (open model) primarily built for  agent-oriented apps.

It is as good as commercial models.

![Pasted image 20250730090222.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/Pasted-image-20250730090222.png)

Similar to [Kimi K2](/blog/claude-code-kimi-k2/), they also provide Anthropic compatible API endpoint which we can use with Claude Code
## How to do it?

Just set these environment variables before running Claude Code cli

```shell
export ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
export ANTHROPIC_AUTH_TOKEN=YOUR_MOONSHOT_API
```

And now, you can start claude code as usual

```shell
claude
```

## How to get API Key?

Go to https://z.ai/model-api

Login with you z.ai account (same as z.ai chat account)

![2025-07-30 at 09.13.16.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-30-at-09.13.16.png)
![2025-07-30 at 09.14.22.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-30-at-09.14.22.png)
![2025-07-30 at 09.14.51 1.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-30-at-09.14.51-1.png)
They don't offer any free credits so you'll need to add some money to try out their API endpoint.

Happy cost optimization!
