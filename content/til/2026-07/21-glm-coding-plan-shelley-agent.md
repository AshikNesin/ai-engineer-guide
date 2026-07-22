---
title: How to use GLM Coding Plan in exe.dev's Shellye Agent
url: til/glm-coding-plan-shelley-agent
tags:
  - bookmark
status: published
date: 2026-07-21T00:00:00.000Z
qblog_id: c37f5d5b-b322-40bd-b6a8-8bb6a2fc5848
---

Recently, I've been playing around with [exe.dev](https://exe.dev). It's a pretty good VM (+ sandbox) with persistent storage, etc.

And I really like their [Shelley Agent](https://github.com/boldsoftware/shelley)

Shelley Agent is actually open source and your can install it using something like homebrew

```shell
brew install --cask boldsoftware/tap/shelley
```

Or direct binary itself.

And Shelley has a way to add custom LLM as well.

## How to configure custom LLM?

Head over to Shelley. It'll be usually `https://your-vm-name.shelley.exe.dev`

![2026-07-21-at-23.44.20.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/zkjoqvgecu1t5j4veec5)

![2026-07-21-at-23.49.33.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/slfvykaphvjqvmaopee7)

![2026-07-21-at-23.54.37.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/a9lw13l9bor9jeiqk7rh)

Choose `OpenAI (Chat API)` and enter the API base and API key

`https://api.z.ai/api/coding/paas/v4`

![2026-07-21-at-23.54.37.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/y9fu7wtszef5xnxlfmja)

Make sure to configure `Image input support` as false.

Once that is done, you can test it to make sure the connection is done properly and save it.
