---
title: Claude Code Real YOLO mode
url: til/claude-code-real-yolo-mode
tags:
  - claude-code
status: published
date: 2026-10-28T00:00:00.000Z
qblog_id: ba507004-1782-4be5-a4b9-8080af8f3de8
---

Even the `--dangerously-skip-permissions` flag on Claude Code does not actually allow dangerous commands like `rm -rf ~`.

However in some case you might want 100% YOLO mode like in VM or sandbox which does not impact you at all.

In such cases, you can env variable to allow any commands

```
export CLAUDE_CODE_EVEN_MORE_DANGEROUSLY_SKIP_PERMISSIONS=1
claude --permission-mode bypassPermissions
```

It's available from Claude Code version v2.1.311+

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-10/holprfkvvvaeh4w9ede3)


## Reference
- https://code.claude.com/docs/en/permission-modes#turn-off-the-critical-path-removal-prompt-in-bypasspermissions-mode
- https://x.com/The_Whole_Daisy/status/2114796466850202103

## Credits
- https://x.com/JinjingLiang/status/2115287799947833770/photo/1 (meme)