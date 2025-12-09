---
title: Mistral Vibe CLI
url: blog/mistral-vibe-cli
tags:
  - mistral
  - mistral-vibe-cli
  - cli-agent
status: published
date: 2025-12-09T00:00:00.000Z
qblog_id: cb3fe3dc-4555-41d5-a47f-65031ad7d980
---

Mistral team has released their agentic coding CLI like Claude Code, Codex, OpenCode, etc

And it is open source (Apache 2.0 license) 😍

At the moment, the features are minimal like file selection but given enough time it might become good one like Open Code.

Right now it has tool like searching (grep), file manipulation like patch,  bash support, MCP support, etc.

And it has support for Agent Context Protocol as well, so it should work well with editors like Zed.

{{< video "https://video.twimg.com/amplify_video/1998406686290157568/vid/avc1/1920x1080/rBfVm762hLbJSAAj.mp4"  >}}

## How to get started?
```shell
curl -LsSf https://mistral.ai/vibe/install.sh | bash
```
And it is powered by Devstral model (they've recently released Devstral 2 🚀)

## Codebase

Unlike majority of the CLI agent, it is build using Python not Node.js like Claude, Gemini CLI, etc.

👉 [GitHub - mistralai/mistral-vibe: Minimal CLI coding agent by Mistral](https://github.com/mistralai/mistral-vibe)

And you can checkout the [CodeWiki for it](https://deepwiki.com/mistralai/mistral-vibe/1-overview) to understand the overall codebase structure.
![2025-12-10-at-00.19.082x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/fxtz4zgusvwp9wmtm7wz)

![2025-12-10-at-00.19.352x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-12/tsgx8t96eadc2iakcwm9)

## Reference

- [Introducing: Devstral 2 and Mistral Vibe CLI. | Mistral AI](https://mistral.ai/news/devstral-2-vibe-cli)