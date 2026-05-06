---
title: Amp Coding agent is getting rebuilt
url: til/amp-coding-agent-rebuild-neo
tags:
  - amp
status: published
date: 2026-05-06T00:00:00.000Z
qblog_id: d3a355a9-ca02-4159-ac17-a2fbc7f77c07
---

[Amp](https://ampcode.com) is getting a revamp of their CLI coding agent.

One thing that I really like about Amp is that as the model progress they remove the feature (yes, remove not add).

Amd this time, they're doing the revamp to support the features like Remote Control, Plugins, Automatic context management, Queuing & Steering, etc

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-05/hizs0le4h8brurqskoyr.mp4" >}}


And they're removing the permission feature. It'll be `YOLO` model by default and you'll need to write the needed config to take care of the permission if needed (they've support for this via their plugins)

Their plugins looks very interesting as well. And sort of similar to how [pi.dev](https://pi.dev) handles it as well.

![2026-05-06-at-22.59.47.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/yovu7m9fy8d7ec3cqfx7)


>A year ago tool calls were simpler to check: inspect the name, inspect the arguments, do string-based matching, allow or deny. Now, frontier models write throwaway scripts to get stuff done. They chain shell commands.

>It's near-impossible to determine statically whether a tool invocation will be destructive or not.

Overall the performance is getting increased as well. Uses less CPU (-78%), less memory (-70%).  

## Reference
- https://ampcode.com/news/neo