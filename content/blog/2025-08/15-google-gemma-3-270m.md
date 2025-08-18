---
title: Gemma 3 270M - Google’s Lightweight On‑Device Model
url: blog/google-gemma-3-270m
status: published
date: 2025-08-15T00:00:00.000Z
description: null
qblog_id: f8f632c7-12e9-4dc5-a3ca-e4139c7b166d
via_url: null
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

When I tried it, the generated answer felt almost instant. 

But in term of accuracy, it is not that good (as you might have already guessed).

## How to use it in Browser?
The demo [Bedtime Story Generator - a Hugging Face Space by webml-community](https://huggingface.co/spaces/webml-community/bedtime-story-generator) actually runs in the model in your browser.

You can use [Transformer.js](https://huggingface.co/docs/transformers.js) to run it.

And you can refer to the bed time story demo on how they've implemented it.

https://huggingface.co/spaces/webml-community/bedtime-story-generator/blob/main/src/hooks/useLLM.ts

## References
- [Introducing Gemma 3 270M: The compact model for hyper-efficient AI - Google Developers Blog](https://developers.googleblog.com/en/introducing-gemma-3-270m/)