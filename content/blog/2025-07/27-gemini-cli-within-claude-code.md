---
title: How to use Gemini CLI within Claude Code
date: 2025-07-27
description: 
tags:
  - TIL
  - claude-code
  - gemini-cli
url: blog/gemini-cli-within-claude-code
via_url:
---
Gemini CLI is currently free and it has large context window (1 million token context window) but it is not as good as claude code.

But sometime for simple things it does the job really well as long as you prompt it well.

So why not let claude code use gemini cli under the hood by utilizing non-interactive mode (`gemini -p`)

For some of the task, this set up works really well. 

And you save token usage in Claude Code 🤑

## Getting Started

Install Gemini CLI and authenticate if not done already

```bash
npm install -g @google/gemini-cli
```

If you authenticate with personal Google account then you get the following free tier
- 60 requests/min
- 1000 model request/day

## Using Gemini CLI within Claude Code

While prompting in claude code, you can mention to use gemini cli. And it will do it under the hood like this

![2025-07-27 at 21.49.43@2x.png](https://images.nesin.io/qblog/AIEngineerGuide/images/2025-07/2025-07-27-at-21.49.43-at-2x.png)
Similarly you can also mention this in your `CLAUDE.md`  as well.

Note: I got this prompt from Grok. Refine it based on your use case.

```markdown
# Using Gemini CLI for Large Codebase Analysis
When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive context window. Use `gemini -p` when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Needing to understand project-wide patterns or architecture
- Working with files totaling more than 100KB
- Verifying specific features, patterns, or security measures across the codebase
Important Notes:
- Paths in @ syntax are relative to the current working directory when invoking gemini
- No need for --yolo flag for read-only analysis
- Be specific about what you're looking for to get accurate results
```

## Using Gemini CLI using MCP

You can also consider using gemini cli as MCP. That gives you more flexibility and can handle advanced use cases.

You can refer this gist by Andrew Altimi

[Claude Code and Gemini CLI Integration via MCP · GitHub](https://gist.github.com/AndrewAltimit/fc5ba068b73e7002cbe4e9721cebb0f5)
## Disclaimer ⚠️

If you're using free gemini cli, then your data might be used for training. As they say it, if you're not paying then you're the produce 😜
## Similar Approaches 
- https://x.com/iannuttall/status/1938695506013601802

Happy vibe coding!