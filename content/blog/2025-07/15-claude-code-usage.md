---
title: How to get Anthropic Claude Code Usage Locally
url: blog/claude-code-usage
tags:
  - claude-code
status: published
date: 2025-07-15T00:00:00.000Z
description: null
qblog_id: 8462b49a-1d51-4d50-81c2-f0661ee473a8
via_url: https://news.ycombinator.com/item?id=44533004
---

Getting aggregated usage cost in Claude Code is not straight forward.

However, all the interaction that you do with Claude Code is stored in `~/.claude/` directory which also includes date, model used, token usage, etc.

With these information we can get the high level overview of it.

You can also use [ccusage - npm](https://www.npmjs.com/package/ccusage) to get a really good report in a nice format 

```shell
npx ccusage@latest
```

Like this 👇
![2025-07-14 at 23.19.11@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-14-at-23.19.11-at-2x.png)
This is especially useful if you do not have access to view those information in Anthropic console.

You can checkout their docs to learn more about the filters supported in ccusage

Happy measuring cost!
