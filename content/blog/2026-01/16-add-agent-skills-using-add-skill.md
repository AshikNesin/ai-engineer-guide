---
title: How to Install Agent Skills Easily Using add-skill package
url: blog/add-agent-skills-using-add-skill
status: published
date: 2026-01-16T00:00:00.000Z
qblog_id: c4e81eae-b012-4196-a513-a46be6e9474a
---

Vercel team has released [add-skill](https://github.com/vercel-labs/add-skill) npm package using it you can easily install Agent Skills using git repo.

Currently it supports OpenCode, Claude Code, Codex, Antigraviry and Cursor.

And there are open PRs to support other AI agents as well.

## How to use it?

```
npx add-skill <git-repo>
```

Like this

```shell
npx add-skill https://github.com/vercel-labs/agent-skills
```

Or something like this for GitHub shorthand

```shell
npx add-skill vercel-labs/agent-skills
```

Vercel team has released [add-skill](https://github.com/vercel-labs/add-skill) npm package using it you can easily install Agent Skills using git repo.

Currently it supports OpenCode, Claude Code, Codex, Antigraviry and Cursor.

And there are open PRs to support other AI agents as well.

## How to use it?

```
npx add-skill <git-repo>
```

Like this

```shell
npx add-skill https://github.com/vercel-labs/agent-skills
```

Or something like this for GitHub shorthand

```shell
npx add-skill vercel-labs/agent-skills
```

![2026-01-16-at-11.03.102x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/sddkmxa6ya5u54q2kh1y)

One thing that I like about it it's DX for example, it'll auto select the agents (based on AI agents like Claude Code, Codex, etx that you're already using)