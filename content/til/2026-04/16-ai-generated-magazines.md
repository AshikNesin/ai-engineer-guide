---
title: Building AI Generated Magazines with Claude or any AI Agents
url: til/ai-generated-magazines
tags:
  - jason-zook
  - ai-workflows
status: published
date: 2026-04-16T00:00:00.000Z
qblog_id: 426e1530-2acd-405f-9d80-1d56d7543be5
---

Jason Zook has built a really cool magazine for him using Claude which fetches the information from his preferred sources (in this case hackernews) and present it in a really good UI

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-04/m7ogneahli3xgwh8ikpg.mp4" >}}


Here is the prompt to replicate it

```markdown
Build me a daily "Morning Edition" magazine.

Every morning, fetch the Hacker News front page and curate the top 10 stories that fit MY taste — skip [TYPE THINGS YOU DON'T WANT]; lean into AI tools, creative software, dev tools, privacy, weird science, and anything actionable. Flag any story that directly applies to me.

Render it as a single self-contained HTML file styled like an editorial magazine: huge display typography (Fraunces + Inter via Google Fonts), and give each of the 10 stories its own distinct spread — different background colors, layout, and numeral treatment (hero, dark/midnight, rose-alert-stamp, terminal, academic drop-cap, big-stat finish, etc.). No small fonts anywhere.

Save it to a magazines/ folder, named YYYY-MM-DD.html. Schedule this to run daily at 7am.

(Optional) Publish each issue to GitHub Pages so I get a real shareable URL, and Telegram-bot me the link every morning when it's ready.
```

## Reference
- https://x.com/jasondoesstuff/status/2044160545540956654