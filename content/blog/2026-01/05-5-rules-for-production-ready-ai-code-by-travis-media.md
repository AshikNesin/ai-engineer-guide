---
title: 5 Rules for Production-Ready AI Code by Travis Media
url: blog/5-rules-for-production-ready-ai-code-by-travis-media
tags:
  - how-to-use-llm
status: published
date: 2026-01-05T00:00:00.000Z
qblog_id: aeb2c63f-0d5f-41ec-9162-0d0cd0c46c5c
---

Travis (from Travis Media) has recently posted a video on how he uses LLM to generate high quality code than getting some slop.

TLDR: The way that you use/guide the LLM can improve/descrease the quality of the output that you're getting.

Here are some of the rules that he has suggested:
1. **Force current document** - He forces LLM to use latest document using [Context7](https://context7.com) MCP so that the LLM has latest context.
2. **Always plan first before doing using LLM** - Leverage plan mode in the tool that you're using.
3. **Review the plan properly, improvise it based on the needs** - If everything is good, then execute it.
4. **Leverage Rules** - Use context file like CLAUDE.md, AGENT.md, GEMINI.md, etc that gets added to every prompt. Using this you can enforce the things that you want in the project like design pattern, workflows like running tests before commiting, etc.
5. **Ask LLM for code review** - LLM are really good in identifying hidden bugs in the code.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/zr6YvtSJY3A?si=tmJlKiFMW3EmZgO2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Happy coding-with LLM!