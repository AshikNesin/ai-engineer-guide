---
title: How to use OpenAI Codex with Z.ai GLM-4.6 Coding Plan
url: blog/openai-codex-with-z-ai
tags:
  - codex
  - openai
  - glm-4-6
  - z-ai
status: published
date: 2025-09-15T00:00:00.000Z
qblog_id: 639b65d7-13bd-4795-9b03-b2f2af7896c6
---

[Codex CLI](https://github.com/openai/codex) is a coding agent similar to Claude Code from OpenAI.

When it was launched it had very basic features but lately they're making it better.

## How to get started?
You can install the package using npm
```shell
npm install -g @openai/codex
```
Or via brew
```shell
brew install codex
```

If you don't have subscription for z.ai's [GLM Coding Plan](https://go.nesin.io/glm), I highly recommend it for side projects where you can get good coding model for pretty cheap. But beware of privacy, they might use your content for training (I'm not sure about this part, but just calling that out just to be on the safe side)

## Configuration
Codex maintains configurations at `~/.codex/config.toml`

### Configuring z.ai model provider
First thing is that we need to create a new z.ai model provider. z.ai has **OpenAI compatible** API which is a hard dependency if you need to use Codex with custom models.

You'll need to add these things in the config file.

```toml
[model_providers.z_ai]
# Name of the provider that will be displayed in the Codex UI.
name = "z.ai - GLM Coding Plan"
# The path `/chat/completions` will be amended to this URL to make the POST
# request for the chat completions.
base_url = "https://api.z.ai/api/coding/paas/v4"
env_key = "Z_AI_API_KEY"
```
Make sure to configure `Z_AI_API_KEY` env variable in your shell.

### Creating GLM 4.6 LLM profile
Now in the config file, we need to create a new profile for the LLM that we want to use.
```toml
[profiles.glm_4_6]
model = "glm-4.6"
model_provider = "z_ai"
```

Basically, we're creating a new profile that points to a particular model provider. And the model name will get passed through.

![2025-09-15-at-23.42.182x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/b1tox8qs2malmuhp8ptq)

## Testing
Once that is done, you should be able to run codex with a particular profile now.

```shell
codex --profile glm_4_6
```

And that will start the codex with the GLM 4.6 model from Z.ai

![2025-09-15-at-23.33.512x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/upujphhjhp7zrb37p0d1)

## Reference
[https://github.com/openai/codex/blob/main/docs/config.md](https://github.com/openai/codex/blob/main/docs/config.md)

Happy AI-assisted coding!