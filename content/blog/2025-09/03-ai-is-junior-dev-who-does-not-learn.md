---
title: AI == Junior Dev who doesn't learn
url: blog/ai-is-junior-dev-who-does-not-learn
tags:
  - claude-code
  - coding
  - talk
status: published
date: 2025-09-03T00:00:00.000Z
qblog_id: 6b583a03-aae3-456f-88bb-6b263b987df1
---

I recently came across the [talk](https://www.sanity.io/blog/first-attempt-will-be-95-garbage) by Vincent Quigley regarding how he uses Claude Code.

Here are my notes from his talk where he explains how he lets AI write the majority of his initial code (80%).

And why **treating AI like a junior dev who doesn't learn** has become his mental model these days.

## The Coding Pivots
In his career, he has had 4 major pivots in the way that he codes.

![2025-09-03-at-23.22.422x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/mm0qzzk83udvqd3dnfmt)

One interesting thing is that each transformation happened **faster** than the previous way of doing things.

## How he develops with AI
> I use AI mostly "to think with" as I'm working with it towards the code that ends up in production.

![2025-09-03-at-23.31.522x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/wusn2sruu9blee8ifsbv)

> Expecting perfection on attempt one is like expecting a junior developer to nail a complex feature without context.

## The Context Problem + Solution
AI can't retain the learning that it has done between sessions. We have to **manually** provide it.

![2025-09-03-at-23.36.002x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/xpaexfzthialh92thcl2)

And here is how he connects other tools with Claude Code
![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/g3j89xqdyqgls2yaljgi)

## PR Process
![2025-09-03-at-23.45.122x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/h7dhtzu2qlzyzwlw4tcf)

## Challenges
![2025-09-03-at-23.45.542x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/t8s17o7vldbgz6ntqdry)

## Cost
Well, I'm seeing this pattern across multiple orgs. And yeah, Claude Code is quite expensive if you use usage-based billing.

It looks like he has 8% of the company spend on Claude Code 😅

![2025-09-03-at-23.46.372x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/qwo7shp13rufvrltocmm)

## Thoughts
![2025-09-03-at-23.45.122x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/mtqjpnjis7j3kip3wmj6)

Background Agents could be a next way of doing things
![2025-09-03-at-23.51.202x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/wqcixe1wbfpz7v8oe0nx)

## What does not work?
> AI doesn't learn from mistakes. You fix the same misunderstandings repeatedly. Your solution: **better documentation and more explicit instructions.**
> AI **confidently writes broken code** claiming that it's great. Always verify
> The context limit problem. Large codebases overwhelm AI context windows. Break problems into smaller chunks and provide focused context.

Happy building-with AI!