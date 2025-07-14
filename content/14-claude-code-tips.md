---
title: Claude Code Tips
date: 2025-07-13
description: 
tags:
  - claude-code
url: blog/claude-code-tips
via_url:
---
## YOLO Mode
By default, claude code will ask lots of questions like can I edit this file? Run that? (basic bash commands), etc

Well, this was indended for good use case of keeping human in the loop.

But it might be overkill for side project or something.

For such cases you can run claude with skip permission flag

```bash
claude --dangerously-skip-permissions
```

It is similar to YOLO mode in cursor

Disclaimer: There is a minor risk that rouge agent might run some unintent commands. But for the brave ones (or the ones that are running Claude code in safe environment like Docker) `--dangerously-skip-permissions` is a huge time saver.

## Code Review

`/install-github-app` command

`claude-code-review.yml` file


```yml
direct_prompt: |
	Please review this pull request and look for bugs and security issues.
	Only report on bugs and potential vulnerabilities you find. Be concise.
```

Default behaviour is it is too verbose. The above prompt make it more concise.

## Stopping Claude during generation
Press escape

Press twice to see previous messages

## Message queuing
 When it is processing add more messages

## Custom commands
 
## Hooks
- Linters and other things 
## Memory

Add `#` before the message
You can now save it in Project memory, Project memory (local) or User memory (Global)



## References
- [How I use Claude Code (+ my best tips) - YouTube](https://www.youtube.com/watch?v=n7iT5r0Sl_Y)
- [Claude Code - 47 PRO TIPS in 9 minutes - YouTube](https://www.youtube.com/watch?v=TiNpzxoBPz0)
- [Claude Code Best Practices \ Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices)
- 

Happy building chat-apps!