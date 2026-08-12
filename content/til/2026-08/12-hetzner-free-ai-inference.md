---
title: Free AI Inference for Hetzner
url: til/hetzner-free-ai-inference
tags:
  - bookmark
status: published
date: 2026-08-12T00:00:00.000Z
qblog_id: 3f64aa4b-e013-4b54-8c22-ea67e12a5c8d
---

Hetzner is experimenting with [AI inference](https://experiments.hetzner.com/inference) service.

Right now, you can go ahead and use their AI inference for free. 

![Screenshot-2026-08-12-at-07-25-35.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-08/nhioclpe9s8igk3sli1w)

## How to get started?

They're providing this **OpenAI chat completion** format. 

Base URL: `https://inference.hetzner.com/api/v1`

Since it's an OpenAI API format, you can just replace the base url and start using this instantly.

```py
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.hetzner.com/api/v1",
    api_key="<YOUR_TOKEN>",
)
```

And you can start working like this

```py
response = client.chat.completions.create(
    model="DeepSeek-V4-Flash-0731",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Why sky is blue?"},
    ]
)

print(response.choices[0].message.content)
```

And the following models are available

| Model | Type | Context Length | Modalities |
|---|---|---|---|
| DeepSeek-V4-Flash-0731 | MoE, 304B total / 13B active | 512,000 tokens | Text |
| GLM-5.2-NVFP4 | MoE, 744B total / 40B active | 512,000 tokens | Text |
| Kimi-K2.7-Code | MoE, 1T total / 32B active | 262,144 tokens | Text, Image |
| Qwen/Qwen3.6-35B-A3B-FP8 | MoE, 35B total / 3B active | 262,144 tokens | Text, Image |



## Reference
- https://experiments.hetzner.com/docs/inference