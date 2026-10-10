---
title: Microsoft's sandboxed code execution system - MXC
url: til/microsoft-execution-container
tags:
  - sandbox
status: published
date: 2026-10-10T00:00:00.000Z
qblog_id: 013ceb2b-300e-480d-8f27-3b9f94fa2ed0
---

Microsoft has released [open source sandbox code execution system](https://github.com/microsoft/mxc)

Under the hood, it uses OS native's sandbox tool like Bubblewrap for linux, Apple's seatbelt, etc

It lets you run your unsafe code (like agent generated code) in a sandbox environment where you can configure the policy like network access.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-10/lqozdtrutooezllo0zpp)

## How to get started?

Just install this package `@microsoft/mxc-sdk` via npm and you can use it like this

```node
import { spawn, type ContainerRequest } from '@microsoft/mxc-sdk/v1';

const request: ContainerRequest = {
  command: 'node -e "console.log(\'hello from container\')"',
  network: { egress: { default: 'deny' } },
  timeoutMs: 30_000,
};

const child = await spawn(request);
```

## Reference
- https://github.com/microsoft/mxc