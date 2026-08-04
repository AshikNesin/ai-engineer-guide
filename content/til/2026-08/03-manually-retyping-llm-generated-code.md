---
title: Why I Manually Type LLM-Generated Code
url: til/manually-retyping-llm-generated-code
tags:
  - engineering
  - how-i-ai
status: published
date: 2026-08-03T00:00:00.000Z
qblog_id: 95cd0645-044e-4fce-9dc9-e8530a9a172c
---

Ankur Sethi has written about his approach on how he uses AI to generate the code but he manually writes them.

> As I manually type every single line of LLM generated code into my editor, I build up a mental model of how it works and fits into my existing codebase. If I don't understand an API or algorithm, I can stop to look it up, or just ask the LLM to explain it.

And he has this instructions in his projects to guide AI

```
I want to understand every line of code that goes into this project. Never create, edit, move, rename, or delete project files unless I explicitly ask you to do so. Instead, show me every proposed edit in the chat so I can type it in manually.

Do not run commands that modify project files, install dependencies, or change repository state unless I explicitly request that action. Instead, show me those commands in the chat so I can run them manually.

I'm an experienced developer. Do not explain syntax, APIs, programming concepts, or implementation details unless explicitly asked.
```

I also do something similar when I need to understand something completely and I find it useful. 

For example, doing so helped me in guiding AI to re-use the existing methods instead of reimplementing everything again and again. Give clear names and avoid complexity.

## Reference
- https://ankursethi.com/blog/prevent-cognitive-debt-by-manually-retyping-llm-generated-code/