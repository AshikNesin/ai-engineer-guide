---
title: Cursor SDK
url: til/cursor-sdk
tags:
  - cursor
status: published
date: 2026-04-29T00:00:00.000Z
qblog_id: ba4a1793-e61e-4425-b006-b665329251fb
---

Cursor has now has SDK which you can wire it up with your apps to build agentic flows easily.

Under the hood it uses same agentic harness that powers the Cursor IDE

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-04/eklw0aslihxihh7yof2b.mp4" >}}

## How to get started?

Just install the package 

```shell
npm install @cursor/sdk
```

And then use it like this

```js
import { Agent } from "@cursor/sdk";

const agent = await Agent.create({
  apiKey: process.env.CURSOR_API_KEY,
  model: { id: "composer-2" },
  local: { cwd: process.cwd() },
});

const run = await agent.send("Summarize what this repository does");

for await (const event of run.stream()) {
  console.log(JSON.stringify(event, null, 4));
}
```


Make sure to set the CURSOR_API_KEY env variable as well.

![2026-04-29-at-23.50.242x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/qk83qu409wza9otlyzys)



They've published [cookbooks](https://github.com/cursor/cookbook) as well which you can use as reference as well.

## Reference
- https://cursor.com/blog/typescript-sdk