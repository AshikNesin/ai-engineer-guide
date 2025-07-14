---
title: How to test MCP using Postmap
date: 2025-07-13
description: 
tags:
  - mcp
  - postman
url: blog/test-mcp-postman
via_url:
---
When I'm building MCP servers I usually use official [MCP Inspector](https://github.com/modelcontextprotocol/inspector#mcp-inspector) then I came to know that [Postman](https://www.postman.com/) supports it out of box.

So for any quick testing, I started using it.

You won't be getting latest stuffs that are added to MCP spec but Postman has covered the things that you'll need 90% of the time :) 

## Getting Started

When you click on "New" (Cmd + N), you should be seeing MCP as one of the option. Select it.

![2025-07-13 at 23.06.24@2x.png](/images/2025-07-13-at-23.06.24-at-2x.png)

Now choose the transport that you want to test like `stdio` or `HTTP` based

![2025-07-13 at 23.11.55@2x.png](/images/2025-07-13-at-23.11.55-at-2x.png)

Then type in the command to connect.

Once you're done you should be seeing the tools that are available for you in that MCP.

![2025-07-13 at 23.13.25@2x.png](/images/2025-07-13-at-23.13.25-at-2x.png)

It supports auth as well
![2025-07-13 at 23.15.17@2x.png](/images/2025-07-13-at-23.15.17-at-2x.png)

Happy testing MCP!