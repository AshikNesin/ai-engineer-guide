---
title: Upstash Box - Serverless Sandbox for AI Agents
url: til/upstash-box-serverless-sandbox
tags:
  - upstash-box
  - sandbox
status: published
date: 2026-03-18T00:00:00.000Z
qblog_id: d20baf79-73d9-41e5-80ae-a06e84d6c275
---

If you need to run AI generated code, it is not a good idea to run in your machine as it might cause BIG security concerns (imagine it wiping out other data or something like that)

So it is better to use sandbox to run those AI generated code.

There are things like [Modal](https://modal.com) or [e2b.dev](https://e2b.dev) which does a great job but it is intented for a heavy usage and might require you to pay a lot (fixed commitment)

That's where [Upstash Box](https://upstash.com/docs/box/overall/quickstart) comes in.

You get:
- Serverless - Pay only for **active CPU** 🔥
- Usage based billing 🤑
- Agents preinstalled (Claude, Codex, OpenCode, etc) 🤖
- Durable
- Infinite lifespan

![2026-03-18-at-23.11.492x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/fzlkojdujcjilcjtwifj)

![2026-03-18-at-23.21.522x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/x9dptiotllmfztyo2w1q)


## How it works?

### Simple Code Execution

```ts
import { Box } from "@upstash/box";

const box = await Box.get("example-slug-48753", {
  apiKey: process.env.UPSTASH_BOX_API_KEY,
});

const run = await box.exec.code({
  lang: "js",
  code: "const x = Math.floor(Math.random() * 100); console.log('Random number:', x);",
});

console.log(run.result); // Random number: 42
```

### Building website using AI Agents

```ts
import { Box, Runtime, ClaudeCode } from "@upstash/box";
 
const box = await Box.create({
  runtime: Runtime.Node,
  agent: { model: ClaudeCode.Opus_4_6 },
});
 
// Run an agent inside your box
const run = await box.agent.run({
  prompt: "Build a minimal portfolio website with Tailwind",
});
console.log(run.result);
 
// Or run any command directly
await box.exec.command("npm run build");
```

## Reference
- [Upstash Box: Give your agents a computer | Upstash Blog](https://upstash.com/blog/upstash-box)