---
title: How to use Google Gemma-4 in OpenClaw
url: til/google-gemma-4-openclaw
tags:
  - google-gemma-4
  - openclaw
status: published
date: 2026-04-04T00:00:00.000Z
qblog_id: 4681e302-fa16-4be8-a604-216c9bccfc49
---

Google has recently released [Gemma 4](https://deepmind.google/models/gemma/gemma-4/) which is an open source (without any catches 😅)

It seems to perform as good as Claude Haiku 4.5, so it might be good for any lightweight and quick job which doesn't need much intelligence. 

![2026-04-04-at-15.23.052x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/lbeogph17iifgqxsegz7)

Let's see how to use this with OpenClaw

## Depedency

We'll be using [llama-server](https://github.com/ggml-org/llama.cpp) for running the LLM locally.

The first thing is we'll need to install llama-server if not installed already

```shell
brew install llama.cpp
```

Once you've that installed, you can just start the server like this

```shell
llama-server -hf ggml-org/gemma-4-26b-a4b-it-GGUF:Q4_K_M
```
![2026-04-04-at-15.28.452x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/zoikoqbtjjpbbl34bedu)


## Configure OpenClaw to use gemma-4
Once the server is running, you can just use it like this in OpenClaw. Bascially, we'll be using custom provider and uses OpenAI's API schema.

```shell
openclaw onboard --non-interactive \
  --auth-choice custom-api-key \
  --custom-base-url "http://127.0.0.1:8080/v1" \
  --custom-model-id "ggml-org-gemma-4-26b-a4b-gguf" \
  --custom-api-key "llama.cpp" \
  --secret-input-mode plaintext \
  --custom-compatibility openai \
  --accept-risk
```

## Reference
- https://x.com/huggingface/status/2040223333921259699
- [Liberate your OpenClaw](https://huggingface.co/blog/liberate-your-openclaw)
