---
title: OpenAI Crawlers/Bots IP Address
url: blog/openai-bots-ip-address
tags:
  - openai
status: published
date: 2025-10-06T00:00:00.000Z
qblog_id: 80200355-b8e2-4456-89bf-f83968cb78f9
---

OpenAI has web crawlers that is used to interact with the online content like website/blog, etc to get more context. They can be either user request (for enable when we use web search feature in ChatGPT, it fetchs the real time context from the internet)

They've 3 types of web crawlers/bot and each one performs specific tasks.

| **Bot User Agent** | **What It's Used For (TL;DR)** | **IP Address** | **Full User-Agent String** |
|--------------------|---------------------------------|----------------|-----------------------------|
| **OAI-SearchBot**  | Used to link to and surface websites in ChatGPT search results (not for training). | [https://openai.com/searchbot.json](https://openai.com/searchbot.json) | `OAI-SearchBot/1.0; +https://openai.com/searchbot` |
| **ChatGPT-User**   | For user actions in ChatGPT and Custom GPTs. Not used for automatic crawling or training. | [https://openai.com/chatgpt-user.json](https://openai.com/chatgpt-user.json) | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot` |
| **GPTBot**         | Crawls content to train generative AI models. Sites can disallow it to opt out of training. | [https://openai.com/gptbot.json](https://openai.com/gptbot.json) | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot` |

![2025-10-06-at-23.44.032x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/h83xmmjvtkklpwzoxb0o)

You can use those IP address to validate those bots (and perform some action like allowing/dening)

## Reference
[https://platform.openai.com/docs/bots](https://platform.openai.com/docs/bots)