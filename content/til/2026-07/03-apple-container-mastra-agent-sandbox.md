---
title: How to use Apple Container for Mastra Agent Sandbox
url: til/apple-container-mastra-agent-sandbox
tags:
  - mastra-ai
status: published
date: 2026-07-03T00:00:00.000Z
qblog_id: d118e29b-fd38-4bfd-8204-a3a8ffb06dcc
---

Apple's [container](https://github.com/apple/container) which is a lightweight [OCI-compatible](https://github.com/opencontainers/image-spec) virtual machine optimized for Apple silicon running on macOS 26+.

[Mastra Agent](https://mastra.ai) has first class support for it.

## How to get started?

```shell
npm install @mastra/apple-container
```

```shell
# Make sure you've installed it
container system start
```

And a sample code snippet from Mastra docs

```js
import { Agent } from '@mastra/core/agent'
import { Workspace } from '@mastra/core/workspace'
import { AppleContainerSandbox } from '@mastra/apple-container'

const workspace = new Workspace({
  sandbox: new AppleContainerSandbox({
    image: 'node:22-slim',
    volumes: {
      '/Users/me/project': '/workspace',
    },
    workingDir: '/workspace',
  }),
})

const agent = new Agent({
  id: 'dev-agent',
  name: 'Dev Agent',
  instructions: 'You are a coding assistant working in this workspace.',
  model: 'anthropic/claude-sonnet-4-6',
  workspace,
})

const response = await agent.generate('Run `node --version`.')
console.log(response.text)
```

## Reference
- https://mastra.ai/reference/workspace/apple-container-sandbox