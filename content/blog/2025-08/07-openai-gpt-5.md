---
title: Notes on OpenAI GPT 5
url: blog/openai-gpt-5
tags:
  - gpt-5
  - openai
status: published
date: 2025-08-07T00:00:00.000Z
description: null
qblog_id: 5aa659bc-ab84-4b1a-bf0e-cbf8a686af84
via_url: null
---

OpenAI has released much hyped [gpt-5](https://openai.com/index/introducing-gpt-5-for-developers/)

From the looks of it, it is going to be a really power model with better pricing.

They claim it is the best model for **agentic tasks** and **coding**

It has 4 variants

| Variant    | Best for                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| gpt-5      | - Complex reasoning<br>- Broad world knowledge <br>- Code Heavy or multi-step agentic tasks                |
| gpt-5-mini | - Cost-optimized reasoning and chat<br>- Balances speed, cost, and capability                              |
| gpt-5-nano | - High-throughput tasks especially simple instruction-following or classification                          |
| gpt-5-chat | - Designed for advanced, natural, multimodal, and context-aware conversations for enterprise applications. |

**## Pricing
In term of pricing it is actually better than the previous models and also majority of the competitors

Here is the standard pricing.
![2025-08-08 at 00.05.23@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-08-at-00.05.23-at-2x.png)

If you want faster [processing](https://platform.openai.com/docs/guides/priority-processing) then you can set `service_tier=priority` when making the request.

![2025-08-08 at 00.08.46@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-08-at-00.08.46-at-2x.png)

Similarly, the pricing for Batch/Flex is follow

![2025-08-08 at 00.09.41@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-08-at-00.09.41-at-2x.png)

## Highlights
- 400k context window
- 128k max output token
- Tool support in Responsese
	- Web Search
	- MCP
	- Image generation
- Support for fine tuning


There is a really good article in Latent Space which covers more about it.
[GPT-5 Hands-On: Welcome to the Stone Age](https://www.latent.space/p/gpt-5-review)

## Reference
- [Using GPT-5](https://platform.openai.com/docs/guides/latest-model)
