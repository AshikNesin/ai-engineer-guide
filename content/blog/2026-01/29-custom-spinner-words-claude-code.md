---
title: How to set Custom Spinner Words in Claude Code
url: blog/custom-spinner-words-claude-code
tags:
  - claude-code
status: published
date: 2026-01-29T00:00:00.000Z
qblog_id: 07567795-1309-444d-8283-100d943d811a
---

When the AI inference is happening. Claude code usually shows some sort of random words verbs.

Now it supports that so that you have full control over that.

## How to to do it?

You can just add this in your claude settigs (`settings.json`

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": [
      "Thinking",
      "Vibe Coding",
      "Architecting"
    ]
  }
}
```

## Reference
- https://xcancel.com/dani_avila7/status/2016700695357923717
