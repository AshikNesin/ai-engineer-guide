---
title: Cline SDK - An Open Source Agent Harness
url: til/cline-sdk
tags:
  - cline
  - agent-harness
status: published
date: 2026-05-13T00:00:00.000Z
qblog_id: 5ba2271b-2a1b-41f3-983e-6c3e3c048ea5
---

The cline team has rebuild their AI foundation and has open sourced their core agent harness as sdk.

It now powers their VS Code, JetBrains, and the CLI, etc.

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-05/v7hoplwydtshxnvhyrnd.mp4" >}}

It is also interesting to see that it has performed well better than claude code with Anthropic models.

![2026-05-13-at-22.49.542x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/u7slsquhwj2cj1ouci74)


## How to get started?

```shell
npm i @cline/sdk
```

You can also install the skill as well]

```shell
npx skills add cline/sdk-skill
```

## Architecture
It is built on TypeScript stack and each module/layer has single responsibility which you can install individually if you need.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/kzqbdpjoj169oydxxwrp)

And also it has support for [plugins](https://github.com/cline/cline/tree/main/sdk/examples/plugins) as well. And it is similar to [pi agent](https://pi.dev)

Here are some of the examples
- https://github.com/cline/cline/tree/main/sdk/apps/examples
- https://github.com/cline/cline/tree/main/sdk/examples

## Reference
- https://x.com/cline/status/2054580767779700775
- https://cline.bot/blog/introducing-cline-sdk-the-upgraded-agent-runtime