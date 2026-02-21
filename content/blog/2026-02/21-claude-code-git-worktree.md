---
title: Claude Code Now Supports Git Worktrees (Built-In)
url: blog/claude-code-git-worktree
tags:
  - claude-code
status: published
date: 2026-02-21T00:00:00.000Z
---
Claude Code now has built-in support for [git worktree](https://git-scm.com/docs/git-worktree).

You can use this feature by passing `--worktree` arg when starting claude code

```shell
claude --worktree
```

By leveraging this feature, we can build multiple things in the same repo in parallel without interfering with one other (codebase)

Matt has a really quick walkthrough video about it which you might find useful

{{< video "https://video.twimg.com/amplify_video/2025240042772279297/vid/avc1/1920x1080/rEvf5NP6XkJj6Qv8.mp4" >}}



## Reference
- https://x.com/bcherny/status/2025007393290272904
- https://x.com/mattpocockuk/status/2025242370816487487
