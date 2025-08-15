---
title: PR Arena - AI Coding Agent Leaderboard
date: 2025-06-29
description: 
tags:
  - TIL
  - leaderboard
url: blog/ai-coding-agent-leaderboard
via_url:
---
There are lots of coding agents out there at the moment. 

You just assign a task to it. It'll plan, research, build, test, etc as if a software engineer was doing it (at least for easy to medium level complexity)

Here is a leaderboard of the top AI Coding Agents based on the info that is available in  public GitHub - Draft PR created, PR merged, PR closed, etc.

You can check it out here: https://prarena.ai

![2025-06-29 at 23.05.39@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-06-29-at-23.05.39-at-2x.png)
![2025-06-29 at 23.11.21@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-06-29-at-23.11.21-at-2x.png)
## Data Source
Intestinally, it is just a GitHub search queries.

Based on the branch prefix or git author that is specific to an AI Coding agent it gets the metrics and updates in the website regularly.

GitHub query string <> stats mapper
![2025-07-01 at 09.44.34@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-07-01-at-09.44.34-at-2x.png)

And in case, if you want direct link for that (got this from their README)

| Description        | GitHub Search Link                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| All Copilot PRs    | [Link](https://github.com/search?q=is:pr+head:copilot/&type=pullrequests)                              |
| Merged Copilot PRs | [Link](https://github.com/search?q=is:pr+head:copilot/+is:merged&type=pullrequests)                    |
| All Codex PRs      | [Link](https://github.com/search?q=is:pr+head:codex/&type=pullrequests)                                |
| Merged Codex PRs   | [Link](https://github.com/search?q=is:pr+head:codex/+is:merged&type=pullrequests)                      |
| All Cursor PRs     | [Link](https://github.com/search?q=is:pr+head:cursor/&type=pullrequests)                               |
| Merged Cursor PRs  | [Link](https://github.com/search?q=is:pr+head:cursor/+is:merged&type=pullrequests)                     |
| All Devin PRs      | [Link](https://github.com/search?q=is:pr+author:devin-ai-integration[bot]&type=pullrequests)           |
| Merged Devin PRs   | [Link](https://github.com/search?q=is:pr+author:devin-ai-integration[bot]+is:merged&type=pullrequests) |
| All Codegen PRs    | [Link](https://github.com/search?q=is:pr+author:codegen-sh[bot]&type=pullrequests)                     |
| Merged Codegen PRs | [Link](https://github.com/search?q=is:pr+author:codegen-sh[bot]+is:merged&type=pullrequests)           |

## Current Score

![2025-06-29 at 23.18.51@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-06-29-at-23.18.51-at-2x.png)

## Source
- https://github.com/aavetis/PRarena

Happy watching stats!
