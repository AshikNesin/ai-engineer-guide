---
title: Z.ai's GLM Coding Plan - Like Claude Code but Cheaper
url: blog/z-ai-glm-coding-plan
tags:
  - claude-code
  - z-ai
  - glm-4-5
status: published
date: 2025-09-06T00:00:00.000Z
qblog_id: f658b917-97c6-4217-a89a-219d04085e27
---

Recently, we've talked about Z.ai's [GLM-4.5](/blog/claude-code-z-ai-glm-4-5/) which was performing as well as Anthropic's Sonnet 4 for coding.

And you can use it in Claude Code.

It seems they've recently launched a subscription plan using which you can save a lot of cost and the best thing is you can use it in Claude Code.

You can get started with their $3/mo plan or you can go with $15/mo plan.

![2025-09-06-at-23.57.482x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/u9z6zu8jifmlkxnrxl6n)

I've got their $15 plan and it looks pretty decent. 

## How to use it with Claude Code
Just set these env variables before starting claude code.

```bash
export ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
export ANTHROPIC_AUTH_TOKEN=$YOUR_API_KEY
```
Make sure to set `$YOUR_API_KEY` with your z.ai's API key.

And then run `claude`

## How is it?
I tried to refactor one of my side project - [qblog](https://x.com/AshikNesin/status/1954082913609547931) using which I'm writing blog post for this blog. 

It codebase is kind of mess. Vibe coded one. So I'm doing initial refactoring and here is the plan it came to organize the UI related files 👇

![2025-09-06-at-23.48.352x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/uja46ht1jwe2dh6maxxt)

Happy cost-effective AI!