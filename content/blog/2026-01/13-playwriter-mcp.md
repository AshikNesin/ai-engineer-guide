---
title: Playwriter MCP - Lightweight Alternative to Playwright MCP
url: blog/playwriter-mcp
tags:
  - playwriter-mcp
status: published
date: 2026-01-13T00:00:00.000Z
qblog_id: d99d714a-b4b7-4b82-b136-cf5ca863cb6a
---

Whether you want to use your existing browser so you handle some actions like login, captcha, etc from your end and let AI do other things like automating, scraping, bug fixing, etc.

Or you just want a simple lightweight alternative to [Playwright](https://github.com/microsoft/playwright) that does not bloat your context window.

You'll find [Playwriter MCP](https://github.com/remorses/playwriter) pretty useful.

![2026-01-13-at-21.31.24.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/iwcpya1qzufn9szhxyn8)

> Like Playwright MCP but via extension. 80% less context window. 10x more capable (full playwright API)

## How to get started?

All you need to do:

1. Install the [Chrome Extention](https://chromewebstore.google.com/detail/playwriter-mcp/jfeammnjpkecdekppnclgkkffahnhfhe)

2. Click on Playwriter MCP extension icon on any tab you want to control - this tab will be used by Playwrite MCP

3. And now your Playwriter MCP can control the tab 🤖

![2026-01-13-at-21.34.58.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/pcuztrvsatmmkxthcmdo)

## MCP Configuration

```json
{
  "mcpServers": {
    "playwriter": {
      "command": "npx",
      "args": ["playwriter@latest"]
    }
  }
}
```

The MCP will expose the following tools:
1. execute - Using this tool the MCP will control the tab that you've given permission earlier.
2. reset

![2026-01-13-at-21.26.07.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/x7nrfn7bfoqirviq5i6i)

And now AI agents can interact with it

![2026-01-13-at-21.37.51.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/l0extkudzkcjygiubfma)

Happy automating browser!