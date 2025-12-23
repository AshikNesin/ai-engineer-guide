---
title: Vercel Removed 80% of Agent Tools and Accuracy Went Up
url: blog/vercel-agent-tools-cut-improved-accuracy
tags:
  - vercel
  - tools
  - case-study
status: published
date: 2025-12-23T00:00:00.000Z
qblog_id: ba09586d-e51f-4712-af1c-7b5e46999fc2
---

Vercel's engineering team has built their own internal text-to-SQL agent (d0) with many custom tools, prompt engineering, context management and all the magic that we need to build an AI app.

Though the app worked it was kind of fragile and needed constant maintenance.
![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/f7hydu5uytzdbsreufex)

![2025-12-23-at-22.36.122x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/qvlz3qs1varhrqts9qq1)

So what they did is they stripped away all the tools and just gave `arbitrary bash execution` tool powered by their [Sandbox](https://vercel.com/sandbox) feature (obviously!)

![2025-12-23-at-22.37.062x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/iew4it9ja9u8icn1vzuw)

Based on their benchmarks here are the results:
- Success rate jumped to 100% (from 80%)
- Fewer tokens - fast response & cost
- AI model interacted with raw data instead of something over engineered.

> Addition by subtraction is real. The best agents might be the ones with the fewest tools. Every tool is a choice you’re making for the model. Sometimes the model makes better choices.

The key takeaway is that more tools does not mean better result.

Sometime, it could be reason why we don't get correct result. So less tools are better 😅

## Reference
[We removed 80% of our agent’s tools - Vercel](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)