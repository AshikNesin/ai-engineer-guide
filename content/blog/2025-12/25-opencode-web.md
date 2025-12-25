---
title: OpenCode Web - An Open Source Alternative to Claude Code on Web
url: blog/opencode-web
tags:
  - opencode
status: published
date: 2025-12-25T00:00:00.000Z
qblog_id: 7ffc7c92-6938-4eb4-8c76-4cb93d5ced4f
---

[OpenCode](https://opencode.ai/) is a AI coding agent like Claude Code. But unlike Claude Code it is [open source](https://github.com/sst/opencode) MIT

In the last couple of months, they've released lot of cool things (which is not available in other CLI based agents yet)

For example, LSP support, Multi-session, ACP support,  using your own model, subscriptions like Claude Code/GitHub Copilot, etc
![2025-12-25-at-23.13.15.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/fg8qpp6lssanhtx6wqe2)

Today I came to know that they provide web feature out of box.

We can just run OpenCode in some server (behind some VPN like Tailscale). And there you have your own AI agent platform similar to Claude Code on Web.

## How to get started?
Install OpenCode if not already done

```shell
pnpm install -g opencode-ai
```

And configure your AI provider. In my case, I was using my [GLM Coding Plan](https://go.nesin.io/glm)

![2025-12-25-at-12.39.04.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/vjog50btw5xta0g7ckja)

![2025-12-25-at-12.38.49.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/uloq8p9nxxdkiqcfv61o)

## Run OpenCode Web

Just run 
```shell
opencode web
```

You can also configure it to run on custom port or allow hostname binding like this

```shell
opencode web --hostname 0.0.0.0 --port 8888

```

It'll start the OpenCode in background and you can access it at http://127.0.0.1:4096

It is full blown, you even have access to Terminal, change diff, sharing, etc.

![2025-12-25-at-13.43.53.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/lu6znbfnurqlrdifip8d)

Happy coding-on web!