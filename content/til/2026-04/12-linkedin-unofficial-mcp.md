---
title: MCP Server for LinkedIn
url: til/linkedin-unofficial-mcp
tags:
  - mcp
status: published
date: 2026-04-12T00:00:00.000Z
qblog_id: 1fb49a46-10c5-45a0-9fee-e358f7c5fa8e
---

There is a unoffical MCP server for LinkedIn. 

👉 https://github.com/stickerdaniel/linkedin-mcp-server

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-04/yctyxh0xxecupfdgcqpp.mp4" >}}


It has pretty much all the stuffs that you might want to do in LinkedIn.

![2026-04-12-at-23.39.432x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-04/ukyhmdv64xowo5iu15qv)

## How to get started?

```json
{
  "mcpServers": {
    "linkedin": {
      "command": "uvx",
      "args": ["linkedin-scraper-mcp@latest"],
      "env": { "UV_HTTP_TIMEOUT": "300" }
    }
  }
}
```

But beware, this is an unofficial one. So you might need to be cautious if you decide to use it.