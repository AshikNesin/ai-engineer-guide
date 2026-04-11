---
title: Reducing Output token usage using caveman skill
url: til/reducing-output-token-usage-using-caveman-skill
tags:
  - tools
status: published
date: 2026-04-11T00:00:00.000Z
qblog_id: 8731c3ba-fdb9-4be5-8ca8-7d244221886e
---

As you're already aware for AI inference we pay based on the input and output tokens usage. 

Most of the time, the output uses filter words which you don't want especially when you're coding. You just need TLDR version of it which in turn reduces your output token usage.

That's where [caveman](https://github.com/JuliusBrussee/caveman) skill comes in.

Once you install it, you'll start getting crisp responses like this

![2026-04-11-at-23.48.022x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/cdnpa4zcjjosrqwoflia)

## How to get started?

If you want to use it on Claude Code

```shell
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman
```

And for other agents like codex, cursor, etc

```shell
npx skills add JuliusBrussee/caveman
```

👉 https://github.com/JuliusBrussee/caveman

There is a good video by Prime where he dive deeps. You might find it interesting

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/L29q2LRiMRc?si=DyWgK_l0ARhL20xM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

