---
title: OpenCode SDK
url: til/opencode-sdk
tags:
  - opencode
status: published
date: 2026-01-14T00:00:00.000Z
qblog_id: 2f0b1aaf-0be5-4795-a760-1f2482876662
---

OpenCode AI agents official node SDK which you can use build custom workflows which leverages the OpenCode under the hood.

## How to get started?

Just install the package

```js
npm install @opencode-ai/sdk
```

```js
import { createOpencode } from "@opencode-ai/sdk"

const opencode = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022",
  },
})

console.log(`Server running at ${opencode.server.url}`)

opencode.server.close()
```