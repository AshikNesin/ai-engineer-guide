---
title: TinyClaw - Lightweight wrapper around Claude Code
url: blog/tinyclaw-claude-code-wrapper
tags:
  - tinyclaw
  - claude-code
status: published
date: 2026-02-09T00:00:00.000Z
---
TinyClaw is a lightweight wrapper for Claude Code which you can access via WhatsApp (as of now)

It's a good for someone who prefers to have really small AI assistant unlike OpenClaw which focuses on so many features.

The Archtecture is something like this:
1. You send a message
2. Claude Code executes it and responds. 

```
┌─────────────────┐
│  WhatsApp       │──┐
│  Client         │  │
└─────────────────┘  │
                     ├──→ Queue (incoming/)
┌─────────────────┐  │        ↓
│  Telegram       │──┤   ┌──────────────┐
│  (future)       │  │   │   Queue      │
└─────────────────┘  │   │  Processor   │
                     │   └──────────────┘
Other Channels ──────┘        ↓
                         claude --dangerously-skip-permissions -c -p
                              ↓
                         Queue (outgoing/)
                              ↓
                    ┌─────────────────┐
                    │ Channels send   │
                    │ responses       │
                    └─────────────────┘
```

That's pretty much it!

## Reference
- https://github.com/jlia0/tinyclaw
