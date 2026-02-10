---
title: One-Click MCP Install with Cursor Deeplinks
url: blog/cursor-mcp-deeplink
tags:
  - mcp
  - cursor
status: published
date: 2025-06-05T00:00:00.000Z
description: null
qblog_id: 6ff833a6-ded5-4b64-a159-8fd354cd1b97
---

[Cursor](https://cursor.com) now has support for MCP installation Deeplink. 

**What are deeplink?**
Deep link are special kind of link that helps us to access/perform some action on a app directly from the website.

In our case, we'll be using it to install MCP servers easily without having to do lot of things on our end.

## Cursor MCP

The link looks like this:
`
`cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG`

| Component                   | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `cursor://`                 | Protocol scheme                                       |
| `anysphere.cursor-deeplink` | Deeplink handler                                      |
| `/mcp/install`              | Path                                                  |
| `name`                      | Query parameter for the server name                   |
| `config`                    | Query parameter for base64 encoded JSON configuration |

## How to generate the deeplink?
In their [website](https://docs.cursor.com/deeplinks#generate-install-link), you can paste in [your json](https://docs.cursor.com/context/model-context-protocol#manual-configuration) that is needed to setup MCP server in Cursor

![2025-06-05 at 22.44.55@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-06-05-at-22.44.55-at-2x.png)

And it'll generate the snippet / link which you can use to directly install your MCP
## References
- https://docs.cursor.com/context/model-context-protocol

Happy directly installing!
