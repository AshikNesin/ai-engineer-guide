---
title: Cursor Agent CLI
date: 2025-08-09
description: 
tags:
  - cursor
  - cli-agent
  - cursor-cli-agent
url: blog/cursor-agent-cli
via_url:
---

With the love that that Claude Code is getting among developers, everyone in the AI space wants to get capitalize on the current interest.

Slowly, almost all the AI providers started offering CLI agent. OpenAI's codex, Gemini CLI, qwen, etc

Now, Cursor is launching their CLI agent.

It's still in beta and doesn't have much feature that you get in other tools like claude code.

## Installation
```bash
curl https://cursor.com/install -fsS | bash
```

![2025-08-09 at 08.43.15@2x.png](/images/2025-08-09-at-08.43.15-at-2x.png)

## Getting Started

Once the CLI is installed you can start the app by running `cursor-agent` command.

Like I said before, it does not have many commands at the moment.
![2025-08-09 at 08.45.06@2x.png](/images/2025-08-09-at-08.45.06-at-2x.png)

With that, you can can choose the model that you want to work with. And ask it to do the job 🤖

## Verdict 👎

Will I use Cursor Agent CLI instead of Claude Code?

Most probably, No.

It is not mature enough right now.

When I tried it in my personal project (medium complexity task), it goofed by like replacing the existing .gitignore instead of just appending.

It didn't automatically install the newly added packages.

And the final generated tool didn't work as expected as well 🙈

![2025-08-09 at 23.08.07@2x.png](/images/2025-08-09-at-23.08.07-at-2x.png)

## Reference
- [Cursor CLI | Cursor - The AI Code Editor](https://cursor.com/cli)

Happy CLI coding!