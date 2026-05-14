---
title: glance.sh - SSH Image Paste in AI Agents Workaround
url: til/ssh-image-paste-ai-agents-glance-sh
tags:
  - tools
status: published
date: 2026-05-14T00:00:00.000Z
qblog_id: 288a8b7d-51cb-4d9c-b6bf-c0c0334f1194
---

If you try to paste image/screenshots in your AI agents (like Claude Code, Codex, Droid, Pi, etc) that is running on SSH, it won't work due to the fundamental limitation on how terminals handle clipboard data.

A quick workaround is to use Ben Vinegar's [glance.sh](https://glance.sh)

Just upload your image in glance and it'll be available for your AI agents for the next 30 mins.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/aqzcywlmj0ejps2ftslx)

And then you can just mention in the prompt like below which will in-turn download the image and use it

```
Screenshot: https://glance.sh/0fe6weNtvvXD8Jmscy8p.png
```

## Reference
- https://x.com/bentlegen/status/2054799682149187781
