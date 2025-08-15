---
title: How to Track Claude Code Usage in Real Time
date: 2025-08-10
description: 
tags:
  - claude-code
url: blog/claude-code-token-usage-real-time
via_url:
---
Claude Code team has recently shipped [customizable status lines](https://x.com/_catwu/status/1953927012592366062) feature.

We can combine this with [ccusage](/blog/claude-code-usage/) and we have a a beautiful CLI like this 👇

![2025-08-10 at 11.12.05@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-10-at-11.12.05-at-2x.png)

## Getting Started
Make sure you're on latest version of claude code. If not update it by running the following command

```bash
npm i -g @anthropic-ai/claude-code
```

Add this in your ` ~/.claude/settings.json` file

```json
{
"statusLine": {
    "type": "command",
    "command": "npx -y ccusage statusline"
  }
}
```


![2025-08-10 at 09.22.33@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-10-at-09.22.33-at-2x.png)

That's pretty much it.

Honestly, Anthropic should have provided this as a first class feature. Maybe they're not doing so for business reasons 🤑

## Credits
https://x.com/iannuttall/status/1954272037976842547

Happy tracking usage!
