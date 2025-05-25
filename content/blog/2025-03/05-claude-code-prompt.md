---
title: "Anthropic Claude Code CLI: Prompts & Tool Definitions"
date: 2025-03-05
description: 
tags:
  - system-prompt
  - claude-code
  - anthropic
  - travis-fischer
url: blog/claude-code-prompt
via_url: https://x.com/transitive_bs/status/1894533303644164521
---
Anthropic has recently released [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) - an agentic coding tool (interactive CLI)

You can play around it by installing it in your machine

```sh
npm install -g @anthropic-ai/claude-code
```

But beware, It is not free and you get charged based on your token usage (Anthropic API)

This tool is **not** open source. And you get minified version of the CLI when you install it. 

However, I recently came across a tweet by [Travis Fischer](https://x.com/transitive_bs/status/1894533303644164521) where he has shared the unminified version (not complete?) which he has extracted from npm.

And the following key learning:

- User messages are checked for phrases to activate different levels of **thinking mode**
	- think harder, think intensely, think longer, think really hard, think super hard, think very hard, think about it, think a lot, think hard, think more, megathink  (🤣, those words are still there in the codebase)
	- higher levels = more tokens
- Tech Stack
	- React CLI App built using [commander](https://github.com/tj/commander.js) and [ink](https://github.com/vadimdemedes/ink)
	- Zod for validation
	- Sentry for error logging
	- Has third party inference support
- "tengu" seems to be internal Anthropic codename for this project
- KISS principle when with respect to file context, embedding, RAG or Abstract Syntax Trees
	- Nothing fancy things
	- Just plain old - glob search for filenames (which is what even IDE like Cursor does)
	- [ripgrep](https://github.com/BurntSushi/ripgrep) for file contents
- They support basic planning via the Architect Agent tool and sub-agent invocations via the Task tool (aka dispatch_agent) -- bare minimum at the moment
- Their documentation [list of tools ](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview#tools-available-to-claude)matches the implementation.
- They auto-create a `CLAUDE\.md` file to serve as memory for project structure, guidelines, conventions, and common commands.
	- When creating this file, they'll existing prompts like [Cursor rules](https://docs.cursor.com/context/rules-for-ai) or GitHub Copilot (no Windsurf at the moment)
- They check for potential malicious intent (like malware creation) and decide whether to process the request or not.

### Code Snippet

<script src="https://gist.github.com/transitive-bullshit/487c9cb52c75a9701d312334ed53b20c.js"></script>
### References
- [Fireship video about Claude Code](https://www.youtube.com/watch?v=x2WtHZciC74&ab_channel=Fireship)
- [Travis Fischer's Gist](https://gist.github.com/transitive-bullshit/487c9cb52c75a9701d312334ed53b20c)

Happy understanding Claude-Code!