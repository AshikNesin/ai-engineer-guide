---
title: How to use OpenAI’s gpt-oss models in Ollama
date: 2025-08-05
description: 
tags:
  - ollama
  - gpt-oss
url: blog/ollama-openai-gpt-oss
via_url:
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