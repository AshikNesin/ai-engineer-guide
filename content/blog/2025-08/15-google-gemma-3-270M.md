---
title: Gemma 3 270M - Google’s Lightweight On‑Device Model
date: 2025-08-15
description: 
tags: 
url: blog/google-gemma-3-270M
via_url:
---
Google has released a TINY model that embodies the **right tool for the job** philosophy. 

It's a 270M (yeah, million not billion 😅)

It has support for full model **fine tune** support. For example, you can fine tune it using [Transformers](https://ai.google.dev/gemma/docs/core/huggingface_text_full_finetune)

And it is primarily intent for on-device LLM use cases.

Here is a quick demo of Bedtime story generator  that runs entirely on your browser using  Transformers.js👇
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ds95v-Aiu5E?si=RdFFdtyHaOmM2unO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## How to use it using Ollama?

Just run 

```
ollama run gemma3:270m
```
