---
title: How to use GLM-5 in Droid CLI (Factory Droid)
url: blog/glm-5-in-droid-cli
tags:
  - droid-cli
  - glm-5
  - glm-coding-plan
status: draft
date: 2026-02-20T00:00:00.000Z
---

Factory Droid supports custom models via Bring Your Own Key, we easily configure it to use GLM-5 as well.

You can use GLM-5 (GLM Coding Plan) with [Droid](https://factory.ai/) pretty easily.

## Step 0: Install Droid CLI
Install the droid cli

If not done already, you install it like this:

## Configure GLM models
Our configs will be at `~/.factory/settings.json`

### Anthropic Model 

```json
{
  "customModels": [
    {
      "displayName": "GLM-5 [Z.AI Coding Plan]",
      "model": "glm-5",
      "baseUrl": "https://api.z.ai/api/anthropic",
      "apiKey": "your_zai_api_key",
      "provider": "anthropic",
      "maxOutputTokens": 131072
    }
  ]
}
```
Simlarly you can also use the OpenAI's chat-completion like this
```json
{
  "customModels": [
    {
      "displayName": "GLM-5 [Z.AI Coding Plan]",
      "model": "glm-5",
      "baseUrl": "https://api.z.ai/api/coding/paas/v4",
      "apiKey": "your_zai_api_key",
      "provider": "generic-chat-completion-api",
      "maxOutputTokens": 131072
    }
  ]
}
```

## Reference
- https://docs.z.ai/devpack/tool/droid
