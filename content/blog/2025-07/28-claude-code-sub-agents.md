---
title: How to use Claude Code Sub Agents
url: blog/claude-code-sub-agents
tags:
  - til
  - claude-code
status: published
date: 2025-07-28T00:00:00.000Z
description: null
qblog_id: 7242a80e-6799-4314-8ec6-abe3280677b9
via_url: null
---

Like the unix principle - Do one thing, do it well.

If an AI agent has to do only one task, it does the work really well.

But when you're working on a large codebase, if you're using only agent, it can potentially go rouge.

That's where **Sub agents** feature in Claude Code comes in.

## What are sub agents?
It is a **custom** agents that you can invoke to perform certain task.

You can configure it based on your needs - system prompts, tools, etc.

And the best part is it has a **separate context window**.

{{< video "https://video.twimg.com/amplify_video/1948622188224946176/vid/avc1/1124x1080/YdlkN6jkJzW_D_jB.mp4"  >}}
## What the benefits of using it?

![2025-07-28 at 23.19.57@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-28-at-23.19.57-at-2x.png)

## How to get started?

Run the following command in claude code

```bash
/agents
```

Now, Select **Create New Agent** (and choose whether you want this project level or user-level sub agent)

Then, define the sub agent. 

Let claude generate the first draft for your sub agent. You can make changes on top of it.

You can use the [available](https://docs.anthropic.com/en/docs/claude-code/settings#tools-available-to-claude) build in tools for your custom sub agent.

## Where is the sub agents are stored?

It's markdown file stored in the following places

| Type                   | Location            | Scope                         | Priority |
| ---------------------- | ------------------- | ----------------------------- | -------- |
| **Project sub agents** | `.claude/agents/`   | Available in current project  | Highest  |
| **User sub agents**    | `~/.claude/agents/` | Available across all projects | Lower    |

## Example 

Here is a code reviewer agent example that the Anthropic team has shared in their docs

```md
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is simple and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

## References
- [Sub agents - Anthropic](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- https://x.com/claude_code/status/1948622899604050063

Happy creating agents!
