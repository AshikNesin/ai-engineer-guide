---
title: How to make Antigravity IDE use AGENTS.md (or CLAUDE.md) Automatically
url: til/make-antigravity-use-agents-md-automatically
tags:
  - google-antigravity
  - agents-md
status: published
date: 2025-12-31T00:00:00.000Z
qblog_id: 785a281f-c112-469e-8ef5-bf03e2606d0e
---

[Antigravity](https://antigravity.google/) IDE automatically loads `~/.gemini/GEMINI.md` and uses it for all the conversation however it does not load `CLAUDE.md` or `AGENTS.md` out of box.

And symlinking `GEMINI.md` to those files also doesn't seem to work properly as well.

So as a workaround what we can do is basically use their **rules** feature to make it work.

## How to do it?

Set a global rule to load those files like this in `~/.gemini/GEMINI.md` 

```markdown
- Check for the presence of AGENTS.md files in the project workspace

- There may be additional AGENTS.md in sub-folders with additional specific instructions that are related to only that part of the codebase.
```

![2025-12-31-at-13.10.152x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/gb9zrhfayrguddltmttf)

## Reference
- [Google Antigravity - Rules](https://antigravity.google/docs/rules-workflows)
- [Reddit - What is the Claude.md equivalent in Antigravity?](https://www.reddit.com/r/google_antigravity/comments/1pgpwlk/what_is_the_claudemd_equivalent_in_antigravity/)