---
title: How to use Google Gemma 4 locally with llama.cpp
url: til/google-gemma-4-locally-llama-cpp
tags:
  - google-gemma-4
status: published
date: 2026-04-02T00:00:00.000Z
qblog_id: 585dc3c8-05fe-4bda-99d7-da5839a23aa9
---

Similar to Ollama, you can also use [llama.cpp](https://github.com/ggml-org/llama.cpp) to run LLM in your machine as well.

## Getting Started
If you're on macOS, you can install llama.cpp using brew like this

```shell
brew install llama.cpp
```

## Running the LLM

Depending on the machine, you might want to run appropriate LLM

![2026-04-02-at-23.30.382x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/o7tokfal4vryntxg7cm6)

```shell
llama-server -hf ggml-org/gemma-4-E4B-it-GGUF:Q8_0
```

## Reference
- https://x.com/victormustar/status/2039739591276581118