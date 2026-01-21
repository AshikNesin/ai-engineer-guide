---
title: How to Extend Cursor Agent Behavior with Lifecycle Hooks
url: blog/cursor-agent-lifecycle-hooks
tags:
  - cursor
status: published
date: 2026-01-19T00:00:00.000Z
qblog_id: aac2d493-b085-4a75-a0a3-8726de067bf8
---

Cursor (latest version) has a hooks feature similar to Claude Code using it you can run your custom script before/after AI Agent execution lifecycle.

For example, you can run a script that validates if a shell command is safe to run, flag any potential security issue, run formatter after edits, etc

{{< video "https://cursor.com/docs-static/images/agent/hooks.mp4" >}}

## How does it work?
It runs the script in a new process and communicate over stdio using JSON

## Available Hooks

Currently, hooks are available in both (tab/inline completion) and Agent.

As for inline completion, it only has the following two hooks

| Trigger            | Description                           |
|--------------------|---------------------------------------|
| beforeTabFileRead  | Control file access for Tab completions |
| afterTabFileEdit   | Post‑process Tab edits                |

And agents has the following hooks

| Trigger                              | Description                           |
|----------------------------------------|---------------------------------------|
| `sessionStart / sessionEnd`            | Session lifecycle management           |
| `beforeShellExecution / afterShellExecution` | Control shell commands                 |
| `beforeMCPExecution / afterMCPExecution` | Control MCP tool usage                 |
| `beforeReadFile / afterFileEdit`       | Control file access and edits           |
| `beforeSubmitPrompt`                   | Validate prompts before submission      |
| `preCompact`                           | Observe context window compaction       |
| `stop`                                 | Handle agent completion                 |
| `afterAgentResponse / afterAgentThought` | Track agent responses                  |

## How to create a hook?
You can place it at project level (`$REPO/.cursor/hooks.json`) or globally (`~/.cursor/hooks.json`)

And it'll have a structure like this

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": "./hooks/custom-script.sh" }]
  }
}
```

Make sure to set that script as executable

```
chmod +x ~/.cursor/hooks/custom-script.sh
```

Now the above script will run after every file edit.

You can use Typescript for custom script as well and you can run it with `bun`

Something like this:

```json
{
  "version": 1,
  "hooks": {
    "stop": [
      {
        "command": "bun run .cursor/hooks/track-stop.ts --stop"
      }
    ]
  }
}
```

## Reference
- https://cursor.com/docs/agent/hooks