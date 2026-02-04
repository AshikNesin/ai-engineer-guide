---
title: "Summarize.sh - LLM powered quick summaries"
url: blog/summarize-sh
status: published
date: 2026-02-04
tags: 
- summarize-sh
---
I came across [summarize.sh](https://summarize.sh) which lets you quickly summarize a link/youtube video, etc. It is built by Peter Steinberger (the one behind OpenClaw)

With the help of it, you can easily summarize something. It also has support for Chrome extension as well.

![2026-02-04-at-23.24.382x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/ahz5ifelirj6xyqrkiqn)

## How to get started?

```shell
npm i -g @steipete/summarize
```

```shell
summarize "https://example.com" --length long
summarize "https://youtu.be/..." --youtube auto
summarize "/path/report.pdf" --model google/gemini-3-flash-preview
```

## Reference
- https://github.com/steipete/summarize
