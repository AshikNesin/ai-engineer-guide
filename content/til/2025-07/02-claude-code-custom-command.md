---
title: How to Add Custom Slash Commands in Claude Code
url: til/claude-code-custom-command
tags:
  - til
  - claude-code
status: published
date: 2025-07-02T00:00:00.000Z
description: null
qblog_id: 0fd7ecec-52d9-4934-a4c3-e9acbb861122
via_url: https://x.com/alexalbert__/status/1940082948445020508
---

Claude Code now supports **custom slash commands** 🌟

Basically, you can think of custom slash commands as a common prompts that you use with Claude Code regularly.

Here are some of the other interesting things about it:
- Store the prompts in a markdown file.
- Has support for namespacing through directory structures.
- Commands are organized by scope (project-specific or personal)

![2025-07-02 at 23.03.17@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-02-at-23.03.17-at-2x.png)


## Command Types

### Project commands
Commands (prompts) are stored in your repo so that you can share it with teams.

**Location**: `.claude/commands/`  
**Prefix**: `/project:`

In the following example, we create the `/project:optimize` command:
```bash
# Create a project command
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md

```
### Personal commands
Commands available across all your projects.

**Location**: `~/.claude/commands/`  
**Prefix**: `/user:`

```sh
# Create a personal command
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```
## Features
####  Namespacing
Just place the commands in a subdirectories.
Organize commands in subdirectories to create namespaced commands.

**Structure**: `<prefix>:<namespace>:<command>`

For example, a file at `.claude/commands/frontend/component.md` creates the command `/project:frontend:component`

### Arguments
Pass dynamic values to commands using the `$ARGUMENTS` placeholder.

Here is an example command 👇

![Pasted image 20250702231028.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/Pasted-image-20250702231028.png)

## References
- https://docs.anthropic.com/en/docs/claude-code/slash-commands#project-commands

Happy open sourcing!
