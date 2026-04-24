---
title: How to use Claude Code hooks to play sound when tasks finish
url: til/claude-code-hooks-play-sound
tags:
  - claude-code
status: published
date: 2026-04-24T00:00:00.000Z
qblog_id: f0b9e544-7d7f-41bf-af2d-5c0b949fb5bf
---

Claude Code has hooks feature using which you can trigger a shell command before certain action is performed like SessionStart, UserPromptSubmit, Notification, Stop, etc.

What you can do is that you can use `afplay` (or similar command depending on your OS) to play sound instead.

Here is how Delba has configured her Claude Code. It's pretty interesting and funny at the same time.

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-04/rvaim5o9wlyeqcjabepf.mp4" >}}

You can also configure something similar for your claude code by adding the needed hooks `.claude/settings.json`

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

You can go crazy with the sounds like Mario or Spongebob which you can get it from here: https://www.myinstants.com/en/search/

## Reference
- https://x.com/delba_oliveira/status/2020515010985005255