---
title: How to use OpenAI’s gpt-oss models in Ollama
url: til/ollama-openai-gpt-oss
tags:
  - ollama
  - gpt-oss
status: published
date: 2025-08-05T00:00:00.000Z
description: null
qblog_id: ba19f52e-0b9e-4272-8751-1f12839417a2
via_url: null
---

OpenAI has recently released open-weight models under Apache 2.0 license. 

It has better support for **agentic tasks** and **reasoning**.

These models are released in 20b and 120b parameters which you can use it locally in your maching using Ollama

## Prerequisite
If you don't have Ollama installed already, then [download](https://ollama.com/download) the latest version and install it.
## How to install it gpt-oss model?
Just install the variant (parameters) that you want to install depending on what you can run it in your machine.

```shell
ollama run gpt-oss:20b
```

```shell
ollama run gpt-oss:120b
```
## Reference
[gpt-oss](https://ollama.com/library/gpt-oss)