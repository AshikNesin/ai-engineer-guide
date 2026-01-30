---
title: Notes on Agent Design Is Still Hard by Armin Ronacher
url: blog/notes-on-agent-design-is-still-hard
tags:
  - bookmark
  - armin-ronacher
status: published
date: 2025-11-24T00:00:00.000Z
qblog_id: 53d732e8-7db3-4f73-aaf9-3d587bc54ce1
---

Armin has written an interesting blog post about why building agents are still hard.

Some of the key highlights:
>TL;DR: Building agents is still messy. SDK abstractions break once you hit real tool use. Caching works better when you manage it yourself, but differs between models. Reinforcement ends up doing more heavy lifting than expected, and failures need strict isolation to avoid derailing the loop. Shared state via a file-system-like layer is an important building block. Output tooling is surprisingly tricky, and model choice still depends on the task.

## Agent SDK
- SDK abstractions like Vercel AI SDK or Pydantic breaking down when working on a real world problem. However he uses Vercel AI SDK only for **provider abstractions** (ability to switch models easily) and maintains [control](https://ai-sdk.dev/cookbook/node/manual-agent-loop) over agent execution
 - However, he would not make that choice again but instead go with building his **own agent abstraction**
 - It is mainly because of differences between models are significant
 - For his use case, none of the SDKs provide right abstraction for him.

> Because the right abstraction is not yet clear, using the original SDKs from the dedicated platforms keeps you fully in control.

With higher-level SDKs we'll ended up building unwanted abstractions just for it.

He also found various challenges when working with Vercel SDK
- Dealing with provider-side tools like web search
- Web search tool from Anthropic destroys the message history with Vercel SDK
- Cache management is easier when using their SDK directly instead of Vercel.
- Anthropic’s case, cache management is much easier when targeting their SDK directly instead of the Vercel one.
- Error messages are much clearer.

## Caching Lessons
Different platform handles caching differently. Anthropic makes you manage the cache **manually**

Though it is kind of pain to manage it, but it makes cost & cache utilization much more predictible.

Explict caching gives you opportunity to do context editing. And also it make it easy to understand the **cost** of the underlying agent.

>The way we do caching in the agent with Anthropic is pretty straightforward. One cache point is after the system prompt. Two cache points are placed at the beginning of the conversation, where the last one moves up with the tail of the conversation. And then there is some optimization along the way that you can do.

> Because the system prompt and the tool selection now have to be mostly static, we feed a dynamic message later to provide information such as the current time. Otherwise, this would trash the cache. We also leverage reinforcement during the loop much more.

## Reinforcement In The Agent Loop
> Every time the agent runs a tool you have the opportunity to not just return data that the tool produces, but also to feed more information back into the loop. For instance, you can remind the agent about the overall objective and the status of individual tasks.

## Reference
👉 [https://lucumr.pocoo.org/2025/11/21/agents-are-hard/](https://lucumr.pocoo.org/2025/11/21/agents-are-hard/)