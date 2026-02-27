---
title: How to use GLM 5 with Conductor
url: blog/glm-5-conductor
tags:
  - conductor
  - glm-5
status: published
date: 2026-02-27T00:00:00.000Z
qblog_id: 06423726-0d7b-4994-8454-b601af405523
---

To use GLM-5 with [conductor](https://conductor.build/), you'll need to configure the respective env variable to override it.

You can configure this in your conductor settings.

![2026-02-27-at-23.49.50.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/kmx4rxqjyvlr0wikuhmo)

```env
    "ANTHROPIC_AUTH_TOKEN": "ZAI_API_KEY",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_API_KEY": "",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air"
```

Once you're done you should now be able to use that model for your AI agents like this

![2026-02-27-at-23.52.28.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/q4ssgi5us8uehw5ftje1)
