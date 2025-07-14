---
title: Vibe Kanban - Like Trello but for Your Ai Coding Agents
date: 2025-07-14
description: 
tags:
  - tools
url: blog/vibe-kanban
via_url: https://news.ycombinator.com/item?id=44533004
---
I came across [vibe-kanban](https://github.com/BloopAI/vibe-kanban) today - essentially a Kanban board (like Trello) for managing your AI agents.
## How does it work?
Simple.

1.  Create a project
2. Add tasks
3. Let the CLI based coding agent do its magic under the hood.

If everything works well, you can rise PR or merge the changes.

And the best part is it is completely open source (Apache-2.0 license)


Note: It is not a polished app (yet?). But it is quite interesting to play around with it for something like a side project.

**Note:** It’s not a polished, production‑ready app (yet?) but it’s a fun tool to experiment with on side projects.

For example, it does not have support for uploading images when sending message to an agent.
## Demo

### Task
> Add RSS icon for the RSS link in the header

Here are the screenshots when I tried to add RSS icon for this blog in navbar.
![2025-07-14 at 17.10.21@2x.png](/images/2025-07-14-at-17.10.21-at-2x.png)
![2025-07-14 at 17.11.14@2x.png](/images/2025-07-14-at-17.11.14-at-2x.png)
Initially, I tried using Gemini CLI, but the results weren’t good. Then I've switched to Claude Code and it worked like a magic 🪄

![2025-07-14 at 17.21.52@2x.png](/images/2025-07-14-at-17.21.52-at-2x.png)
![2025-07-14 at 17.22.13@2x.png](/images/2025-07-14-at-17.22.13-at-2x.png)

![2025-07-14 at 17.23.06@2x.png](/images/2025-07-14-at-17.23.06-at-2x.png)
![2025-07-14 at 17.25.35@2x.png](/images/2025-07-14-at-17.25.35-at-2x.png)
That's pretty much it! 

Here is the change it has made: [AshikNesin/ai-engineer-guide@386c1cc · GitHub](https://github.com/AshikNesin/ai-engineer-guide/commit/386c1ccb17b6d65b1aabfd7fd3ab19e7ddadbf87)

Happy vibe coding


