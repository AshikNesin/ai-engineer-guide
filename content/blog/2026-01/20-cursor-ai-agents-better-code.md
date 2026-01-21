---
title: Using Cursor’s AI Coding Agents for Better Code
url: blog/cursor-ai-agents-better-code
tags:
  - cursor
status: published
date: 2026-01-20T00:00:00.000Z
qblog_id: 7375a6d5-9466-4d2e-938b-2fe59df391c9
---

Almost a year ago, AI models was struglging to do basic tool calling now it can build an entire app from scratch with just a single prompt.

It's up to us to leverage the AI model by using it effectively.

Here are some tips by Cursor team on how to leverage AI to build apps.

## 1. Create a plan before building something

> The most impactful change you can make is planning before coding.

Before starting anything, use `Plan Mode` to plan what you are going to build and then **iterate over** it until it covers your use case as expected then execute it.

In Cursor, you can press `Shift + Tab` to toggle the modes.

Plans are nothing but a markdown file which we can edit directly as well.

Tip: Click "Save to workspace" to store plans in .cursor/plans directory which can be used to resume the work and act as context for future enhancements for the same feature.

{{< video "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-1-0.mp4" >}}

## 2. Let the agent find context that it needs

Modern apps are so good, they can do grep, semantic search, etc to find the context that it needs.

If you know the exact file, tag it. Else let it handle it for you.

Over-tagging might add unwanted things in the context which might affect the quality of the output.

{{< video "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/changelog/changelog-2-1-2.mp4" >}}

## 3. Know when to start new conversation

Long conversations might impact the output quality in negative way. 

So avoid using a big thread for unrelated things. 

If you are starting something new or when the agent is not behaving in the way in which you're expecting then create a new chat. There are exceptions like debugging, bug fixes, etc which might require you to continue in the same conversation itself.

You can also use `@Past Chats` to refer the old conversation as well.

## 4. Extending the agent with Rules & Skills

Leverage [Rules](https://cursor.com/docs/context/rules) and [Skills](https://cursor.com/docs/context/skills) to extend the behaviour of the AI agent.

## 5. Use images

The modern LLMs are really good at understand the images. So you can paste the image in the chat. This is really helpful when working on UI stuffs.

## 6. Do Test Driver Development
First write test case with AI with expected input and output. 

Once you've the test cases, you can make it green by building the needed things.

## And more 👇
Here are some of the other tips by Cursor founder - Michael Truell which he has shared in a tweet.

- Use tests as the feedback loop (TDD + iterate until green)
- When it goes sideways: revert → tighten the plan → rerun
- Keep long chats short; use @ Past Chats for continuity
- Add lightweight .cursor/rules for recurring mistakes
- Use skills + hooks for long-running "grind until tests pass" loops
- Run multiple agents/models in parallel via worktrees

## Reference
- https://cursor.com/blog/agent-best-practices