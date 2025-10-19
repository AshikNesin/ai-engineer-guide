---
title: How to use Ollama Cloud Models like GLM-4.6 with Droid CLI
url: blog/ollama-cloud-models-with-droid-cli
tags:
  - ollama
  - droid-cli
status: published
date: 2025-10-19T00:00:00.000Z
qblog_id: 0fe33037-720c-42dd-a722-d57a9e922e20
---

Ollama [Cloud](https://ollama.com/cloud) lets you LLM model via API. You can think of it something like a basic AI gateway.

## How to use it on Droid CLI?

### Prerequisites
Make sure you've [Droid CLI](https://go.nesin.io/droid). If not, [install it](https://docs.factory.ai/cli/getting-started/quickstart) and login to your account

```shell
curl -fsSL https://app.factory.ai/cli | sh
```

And also get the API key from [Ollama dashboard](https://ollama.com/settings/keys)

### Adding Cloud Config Blog
Now you need to add the custom model in droid config file which you can find at `~/.factory/config.json`

```json
{
  "custom_models": [
    {
      "model_display_name": "GLM-4.6 (Ollama Cloud)",
      "model": "glm-4.6:cloud",
      "base_url": "https://ollama.com/v1/",
      "api_key": "YOUR_OLLAMA_API_KEY",
      "provider": "generic-chat-completion-api",
      "max_tokens": 16384
    }
  ]
}
```

Now you can just select the model in droid cli using the command `/model`

![2025-10-19-at-23.40.052x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/doctszdcvdjgk6hu4agi)

## Reference
- [New coding models & integrations · Ollama Blog](https://ollama.com/blog/coding-models)