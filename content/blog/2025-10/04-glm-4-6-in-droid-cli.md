---
title: How to use GLM 4.6 in Droid CLI
url: blog/glm-4-6-in-droid-cli
tags:
  - z-ai
  - glm-4-6
  - droid-cli
status: published
date: 2025-10-04T00:00:00.000Z
qblog_id: 3f0bdc3c-f09f-4fe7-b989-d1d0f1af1f0b
---

[Droid CLI](https://go.nesin.io/droid) by Factory.ai is an agentic CLI similar to Claude Code but the good thing is that it has support for using custom model (bring your own key).

Let's see how to use GLM 4.6 with Droid CLI. GLM 4.6 by [Z.AI](https://z.ai) is an open source coding model that is performing almost as well as Anthropic Sonnet 4.

The usage cost is pretty cheap but if you've already have [GLM Coding Plan](https://go.nesin.io/glm) subscription, you don't even need to pay for that as well. Instead you'll be paying a standard monthly subscription.

## How to use GLM 4.6 in Droid CLI?

Just add the **custom_models** in the `~/.factory/config.json`

In our case, the custom_models should look like this

```json
{
  "custom_models": [
    {
      "model_display_name": "GLM 4.6 Coding Plan",
      "model": "glm-4.6",
      "base_url": "https://api.z.ai/api/anthropic",
      "api_key": "YOUR_ZAI_API_KEY",
      "provider": "zai"
    }
  ]
}
```

Once you've added the config, you can now use the `/model` command in the `droid` CLI to select that model.
![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/iwwcq6wcx17e9ww9ejii)

That's pretty much it.

## Credits
- [https://x.com/donvito/status/1974329346824585381/photo/1](https://x.com/donvito/status/1974329346824585381/photo/1)

## Reference
- [https://docs.factory.ai/cli/configuration/byok](https://docs.factory.ai/cli/configuration/byok)

Happy AI-assisted coding!