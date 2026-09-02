---
title: How to disable git co-author in Shelley AI Agent
url: til/disable-git-co-author-shelley
tags:
  - shelley-agent
status: published
date: 2026-09-02T00:00:00.000Z
qblog_id: 40629214-fc70-4883-998b-0a22eefb1dbb
---

If you prefer not to have shelley agent not to add itself as co-author in git commits.

You can just disable it.

You can do it either globally or project wise.

```shell
git config --global shelley.no-trailer true
```

Or in project level
```shell
git config shelley.no-trailer true
```