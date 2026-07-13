---
title: How to set a shortcut for sending “continue” in Pi Coding Agent
url: til/continue-shortcut-pi-coding-agent
tags:
  - pi
status: published
date: 2026-07-13T00:00:00.000Z
qblog_id: ef8fde7f-2584-4fde-a334-bc0183272205
---

I came across this simple but effective tip on how to configure shortcut in [Pi.dev](https://pi.dev) by Armin.

As you're already aware that Pi is heavy extensible. In fact, I would say that is their core philosophy.

```js
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerShortcut("shift+alt+enter", {
    description: 'Send "continue" when the agent is stopped',
    handler: (ctx) => {
      if (ctx.isIdle()) pi.sendUserMessage("continue");
    },
  });
}
```

## Reference
- https://x.com/mitsuhiko/status/2076575575683019147