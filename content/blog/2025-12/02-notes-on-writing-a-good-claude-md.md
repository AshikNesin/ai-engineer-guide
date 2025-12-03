---
title: Notes on Writing a good CLAUDE.md
url: blog/notes-on-writing-a-good-claude-md
tags:
  - claude-code
  - notes
  - bookmark
status: published
date: 2025-12-02T00:00:00.000Z
qblog_id: dcd4fe06-07ac-4788-a4f6-05efb6a6836e
---

I came across this really interesting post by Kyle on how to write CLAUDE.md (or AGENTS.md, etc)

Here are some of my key takeaways:
- LLMs are stateless functions. It only knows about the things that you have in context (tokens) regarding your codebase.
- `CLAUDE.md` (or `AGENTS.md`) goes into every single conversation that you have with the agent.

![2025-12-02-at-23.59.152x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/uddmzbkrog964gdlhu5h)

## Onboarding Claude to your codebase
`CLAUDE.md` should have these information at high level.

1. **WHAT**: Tell Claude code about tech stack, project structure and other important things about the project.
2. **WHY**: Tell Claude the purpose of the project and what everything is doing in the repo 😅
3. **HOW**: Tell Claude how it should work on the project. Like using pnpm instead of npm.

## Claude often ignores CLAUDE.md
It is interesting to see that CLAUDE.md might get ignored because of the system prompt in Claude Code

```
<system-reminder>
      IMPORTANT: this context may or may not be relevant to your tasks. 
      You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
```

## Creating a good CLAUDE.md file

### Less instructions that we give to LLM are better.
- There is some [research](https://arxiv.org/pdf/2507.11538) done about how much instructions a LLM can follow (this include instructions that we send via **system instruction + CLAUDE.md  + user messages + others**)

 1. Frontier thinking LLMs can follow **~ 150-200 instructions** with reasonable consistency.
 2. Smaller models get **MUCH worse, MUCH more quickly**.
 3. LLMs bias towards instructions that are on the peripheries of the prompt
 4. **As instruction count increases, instruction-following quality decreases uniformly**

> Our analysis of the Claude Code harness indicates that Claude Code's system prompt contains ~50 individual instructions.

> This implies that your CLAUDE.md file should contain as few instructions as possible

## Reference
[Writing a good CLAUDE.md | HumanLayer Blog](https://www.humanlayer.dev/blog/writing-a-good-claude-md)