---
title: How to use Google Gemma 4 models on Amazon Bedrock
url: til/gemma-4-aws-bedrock
tags:
  - aws-bedrock
  - google-gemma-4
status: published
date: 2026-06-16T00:00:00.000Z
qblog_id: ef7fdf6c-f154-474e-8ac8-e9d2bb3b4972
---

Gemma 4 models are now available on AWS Bedrock where you can just pay based on usage.

It comes in 3 variants (different architecture) which solves for different use cases: 
- Gemma 4 31B
- Gemma 4 26B-A4B
- Gemma 4 E2B

![2026-06-16-at-22.19.572x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/zufintziyiltgz9didep)

![2026-06-16-at-22.17.432x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/qblorbg0hmmpnmzedf9n)

## How to use it?

It is available through `bedrock-mantle` endpoint which exposes the inference via OpenAI-compatible APIs

## Reference
- https://aws.amazon.com/blogs/machine-learning/introducing-gemma-4-models-on-amazon-bedrock/