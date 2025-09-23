---
title: Official Chrome DevTools MCP
url: blog/chrome-devtools-mcp
tags:
  - mcp
status: published
date: 2025-09-23T00:00:00.000Z
qblog_id: 2580cc61-9441-4dbd-a7a1-9ccfb7c71956
---

Google has recently released their [Chrome DevTools MCP](https://developer.chrome.com/blog/chrome-devtools-mcp?hl=en) with it you can use your Chrome DevTools as MCP.

One advantage that it has over using something like Puppeteer or [Playwright MCP](https://github.com/microsoft/playwright-mcp) is that it just uses the **Google Chrome** that you've in your machine.

So you don't need to download the Chrome binary again.

## How to get started?

This is provided as local package MCP. So you can depending on the IDE/MCP client that you're using.

In Cursor, you can install it like this

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

If you don't have Google Chrome in `Application`, you might be getting some error. For such cases you can just explictly define the executable Path

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--executablePath", "/Users/ashiknesin/Apps/Google Chrome.app/Contents/MacOS/Google Chrome"]
    }
  }
}
```

Once you've added it and enabled it, you should be seeing the available tools like this
![2025-09-24-at-00.11.002x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/csxghscoti5munlfpp84)

Happy Browser MCP-ing!