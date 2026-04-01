---
title: Claude Code Source Code Leaked because of Source Map
url: til/claude-code-source-code-leak
tags:
  - claude-code
  - leak
status: published
date: 2026-03-31T00:00:00.000Z
qblog_id: a7b6df77-fb40-412c-9b9e-a2b5d64fb8fc
---

Anthropic by mistake has published Claude Code with [source map](https://web.dev/articles/source-maps) enabled.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/ekcu8dxctqbuqspltfcn)

You can find it here:
- https://github.com/chatgptprojects/claude-code/tree/642c7f944bbe5f7e57c05d756ab7fa7c9c5035cc

There are so many interesting things we can learn from it like how they're handling things internally like the spinner message

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/vlgt8xaxxovilrnowjun)

And how they automatically log negative feedback based on swear words, etc

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/e5fl04lspdrit3nyrak4)

And there are some interesting ports people are building to avoid getting DMCA as well.

https://github.com/instructkr/claw-code/tree/main

The cause of this leak is due to [developer](https://x.com/bcherny/status/2039168928145109343) issue

## Reference
- https://x.com/Fried_rice/status/2038894956459290963
- https://x.com/wesbos/status/2038958747200962952