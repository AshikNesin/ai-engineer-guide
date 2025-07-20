---
title: How to run LLMs locally with Docker
date: 2025-07-20
description: 
tags:
  - docker
url: blog/docker-model-runner
via_url:
---
In order to run AI models locally, I generally use [Ollama](https://ollama.com/) 

But TIL, you can actually run it via docker itself.

## How to get started?
This feature is comes enabled by default if you're on Docker Desktop 4.40+ for macOS on Apple silicon chips.

If not, you can enable it by running the following command

```shell
docker desktop enable model-runner
```

## How to use?

Just pull the model and use it

```
{model}:{parameters}-{quantization}
```

```shell
docker model pull ai/smollm2:360M-Q4_K_M
```

```shell
docker model run ai/smollm2:360M-Q4_K_M "Why sky is Blue?"
```


## How to use it with OpenAI compatible sdk ?

Just set the base url to 

`http://localhost:12434/engines/v1`

And set the model it as whatever model that you're running. In the above case, it'll be `ai/smollm2:360M-Q4_K_M`


Here is a good video by Travis Media about it
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/KL4WU_04CrA?si=WWeTljoW0apTQuiM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## References
- [Run LLMs Locally with Docker: A Quickstart Guide to Model Runner | Docker](https://www.docker.com/blog/run-llms-locally/)

Happy local LLM!