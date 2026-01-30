---
title: How to improvise your prompt or spec using Claude Code
url: blog/improvise-spec-claude-code
tags:
  - claude-code
status: published
date: 2026-01-03T00:00:00.000Z
qblog_id: 1919e76d-6514-421c-924b-c8a9cd8aba37
---

Claude Code's `AskUserQuestionTool` tool can help us to improve prompt/spec so that we can build a feature completely.

## How to do it?

Write initial spec and use Claude Code to enhance it by prompting this

```
read this @SPEC.md and interview me in detail using the AskUserQuestionTool about literally anything: technical implementation, UI & UX, concerns, tradeoffs, etc. but make sure the questions are not obvious

be very in-depth and continue interviewing me continually until it's complete, then write the spec to the file
```

And Clade Code will ask some questions based on the spec and you need to select the answer based on your requirements.

Here's a video by Prompt Engineering where uses this feature to build a text to image generation app using this method.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/WHsRYkwR_YY?si=6uWFgHSECvcoCCxM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Reference
[https://x.com/trq212/status/2005315275026260309](https://x.com/trq212/status/2005315275026260309)