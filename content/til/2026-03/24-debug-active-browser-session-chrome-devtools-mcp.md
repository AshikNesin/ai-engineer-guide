---
title: How to debug your active browser session with Chrome DevTools MCP
url: til/debug-active-browser-session-chrome-devtools-mcp
tags:
  - chrome-devtools-mcp
  - mcp
status: published
date: 2026-03-24T00:00:00.000Z
qblog_id: c171bd64-f5dd-4308-88e2-76da20b38c50
---

Chrome now has first class support for DevTools MCP.

Once you enable it, you can easily let the AI agents to debug the current session.

By using the current session, you don't have to worry about Captcha, Login, etc. Since it'll just reuse the same session in which you've already done it.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/qxwmufctudbtyzxg6yxy)

## How to get started?
By default, this feature is disabled, you can enable it over here `chrome://inspect#remote-debugging`

![2026-03-22-at-15.17.552x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/unpsqr3d0ynbkh2diqht)

And then in the mcp in which you're connecting, make sure to pass `--autoConnect` flag as well.

```json
{
   "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--autoConnect",
        "--channel=beta"
      ]
    }
  }
}
```

To prevent, misuse Chrome will ask confirmation everytime you interact with it.

{{< video "https://developer.chrome.com//static/blog/chrome-devtools-mcp-debug-your-browser-session/video/select-network-request.mp4" >}}


## Reference
- [Let your Coding Agent debug your browser session with Chrome DevTools MCP](https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session)