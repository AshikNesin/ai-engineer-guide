---
title: VS Code Extention for Claude Code
url: blog/claude-code-vs-code
tags:
  - bookmark
  - claude-code
status: published
date: 2025-06-24T00:00:00.000Z
description: null
qblog_id: 84931f18-ba01-44cc-8180-d5c27d92382c
---

Anthropic has recently launched VS Code extention for Claude Code

While interacting with Claude Code in terminal, this extension acts as a compliment to Claude Code CLI.

At the moment, it has support for the following:
- **Selection context**: Selected text gets automatically added as context
- **Diff viewing**: Use VS Code diff view to view your changes
	- Note: Make sure to set diff tool to **auto** in /config command to enable the integration
- **Tab awareness**: Claude can see which files you have open in the editor
- **Keyboard shortcuts**: Support for shortcuts to push selected code into Claude’s prompt

To be honest, these features are pretty simple one and I believe it is more of like baseline rather than a solid state.

👉 https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code

Happy building apps!