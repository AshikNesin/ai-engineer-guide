---
title: OpenAI's Prompt guidance for GPT 5.5
url: til/openai-prompt-guidance-gpt-5-5
tags:
  - openai
status: published
date: 2026-04-27T00:00:00.000Z
qblog_id: 2bf6b547-13c8-4f8b-8326-ed8cc48ec9cb
---

OpenAI has published official prompting guidance for their latest model GPT 5.5

👉 [Prompt guidance | OpenAI API](https://developers.openai.com/api/docs/guides/prompt-guidance?model=gpt-5.5)

Here are some of the takeaways:
> GPT-5.5 works best when prompts define the outcome and leave room for the model to choose an efficient solution path.
- Describe the outcomes, not step by step on how to do like we used to write for older models. The model can figure that out on its own
- Reasoning effort defaults to medium - change it to low/high based on your latency/cost needs and use case.


## Migrating Old Prompt using Codex

You can invoke `$openai-docs migrate this project to gpt-5.5` which uses [Docs Skill](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs) under the hood.