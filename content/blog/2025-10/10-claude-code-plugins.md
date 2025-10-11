---
title: Claude Code Plugin Support
url: blog/claude-code-plugins
tags:
  - claude-code
status: published
date: 2025-10-10T00:00:00.000Z
qblog_id: 5285c2e6-7d29-45b8-a620-7da62b8a33f7
---

Claude Code now has support for plugins using which you can easily share **Slash commands, Subagents, Hooks, MCP Servers**

## Why?
> Moving forward, plugins will be our standard way to bundle and share Claude Code customizations, and we’ll continue to evolve the format as we add more extension points

Instead of manually sharing things, Claude Code team wants us to leverage the plugins to share it.
![2025-10-11-at-12.23.592x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/ljddawnxnwkfnsfdi9ai)

## How to get started?
Make sure you're on latest version of Claude Code (if not `npm install -g @anthropic-ai/claude-code`)

Then enter `/plugins`

![2025-10-11-at-12.17.162x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/hdc11ttx1rpcalnfbjzr)

It'll give you options to manage the plugins like installing/uninstalling plugins & marketplace. You can think of marketplace as a store in which you can install specific plugins.

For example you can add install Anthropic's claude code by running this command

```
/plugin marketplace add anthropics/claude-code
```
And once you install it, you should be able to see these plugins
![2025-10-11-at-12.25.392x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/bensmhm1haizu2nr66po)

**How does it works?**

When you install a plugin by entering something like `/plugin marketplace add anthropics/claude-code`

It'll look for [GitHub repo](https://github.com/anthropics/claude-code/blob/main/.claude-plugin/marketplace.json) or URL with the **.claude-plugin/marketplace.json** file. 

![2025-10-11-at-12.31.112x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/ym5stqnfdmlt8jkyqmvt)

And it'll install the commands like this

![2025-10-11-at-12.32.102x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/bqwwefixuhy2zx2p0xn9)

For more details on how to create & publish your workflows refer their [docs](https://docs.claude.com/en/docs/claude-code/plugins-reference) which has really good info about it.

## Reference
[Customize Claude Code with plugins \ Anthropic](https://www.anthropic.com/news/claude-code-plugins)