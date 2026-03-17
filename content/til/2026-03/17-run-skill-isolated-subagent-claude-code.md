---
title: How to run a Skill in Isolated Subagent in Claude Code
url: til/run-skill-isolated-subagent-claude-code
tags:
  - claude-code
  - skills
status: published
date: 2026-03-17T00:00:00.000Z
qblog_id: 6a0377fb-073b-4b8c-8ff8-c0583823a9c4
---

Just by adding `context: fork` in skill's frontmatter, you can let the skill to run as a subagent with **fresh context window + CLAUDE.md + skill's prompt**

You can also add `agent` field to let set the subagent type like Explore 

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/ctdcyqzvxk16xng07smf)


## Reference
- https://x.com/lydiahallie/status/2033603164398883042