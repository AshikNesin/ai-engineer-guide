---
title: Agent Plugins - Open Standard for AI Agents
url: til/agent-plugins
tags:
  - bookmark
status: published
date: 2026-08-06T00:00:00.000Z
qblog_id: 91a5024c-cf7a-4fa9-b0bb-bfd9b83a8cdf
---

If you wanted to release your skills/MCP for a AI apps like Cursor, Codex, etc, you'll need to publish it in the way that the apps are expecting.

There is no standard want to handle it.

That's what **Agent Plugins** spec is trying to solve.


> Agent Plugins is an open, vendor-neutral standard for packaging reusable components into portable plugins. Its version 1.0.0 specification defines a shared format for Agent Skills and MCP servers that compatible clients can discover and load consistently.

An Agent Plugin is a directory with a **required manifest** and optional components in fixed locations:

```md
my-plugin/
├── plugin.json
├── skills/
│   └── summarize/
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
├── mcp.json
└── com.example.client/
    └── hooks/
```

As of now, it'll be supported in these apps: ChatGPT and Codex, Cursor, GH Copilot, Kiro, VS Code.

## Reference
- https://agent-plugins.org/
- https://x.com/OpenAIDevs/status/2085398373511918022