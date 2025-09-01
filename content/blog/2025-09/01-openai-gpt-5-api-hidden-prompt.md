---
title: OpenAI injects hidden prompt in GPT-5 API
url: blog/openai-gpt-5-api-hidden-prompt
tags:
  - openai
  - gpt-5
status: published
date: 2025-09-01T00:00:00.000Z
qblog_id: aee8196d-0eb4-40dd-813a-831fa658b008
---

Apparently OpenAI's GPT-5 **injects** a hidden system prompt on their end even if you use the API.

For example, the majority of LLMs have a cutoff date, which means they won't have access to recent or real-time data unless that is explicitly added in the prompt.

And it won't be able to answer even a simple question like **today's date**.

But when I tried to ask it for the "current date", it responded correctly.

![2025-08-28-at-22.31.002x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/jkifzijxyrabwidoeztq)

This aligns with Tommy's recent [tweet](https://x.com/xundecidability/status/1956347084870651960/photo/1) claiming that OpenAI is injecting the following prompt for every API call.

```markdown
Current date: 2025-08-28

You are an AI assistant accessed via an API. Your output may need to be parsed by code or displayed

# Desired oververbosity for the final answer (not analysis): 3

An oververbosity of 1 means the model should respond using only the minimal content necessary to satisfy the request, using concise phrasing and avoiding extra detail or explanation.

An oververbosity of 10 means the model should provide maximally detailed, thorough responses with context, explanations, and possibly multiple examples.

The desired oververbosity should be treated only as a *default*. Defer to any user or developer requirements regarding response length, if present.

# Valid channels: analysis, commentary, final. Channel must be included for every message.
# Juice: 64
```

And this hidden prompt might lead to unexpected behavior. 
![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/sy9mhrhltzr6vsce4pu4)

## Reference
- https://simonwillison.net/2025/Aug/15/gpt-5-has-a-hidden-system-prompt/