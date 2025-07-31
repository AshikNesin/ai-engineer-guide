---
title: How to MCP Servers with MCPJam Inspector
date: 2025-07-30
description: 
tags:
  - mcp
url: blog/mcp-server-testing-with-mcpjam
via_url:
---
I recently came across [MCPJam](https://www.mcpjam.com/)

**What does MCP Jam does?**
Pretty much everything that you need to test a MCP server

Whether you want to test stdio/remote server or want to use local LLM using Ollama. 

It got you covered.

And the best part is it is [open source](https://github.com/MCPJam/inspector)
## How to get started?

```shell
npx @mcpjam/inspector@latest
```

And that'll will start the server in port 3000 by default

If you want to start it in different port then pass `--port`  argument with the desired port number
![2025-07-31 at 22.47.50@2x 1.png](/images/2025-07-31-at-22.47.50-at-2x-1.png)
Once it starts, you can add your MCP server. It has support for both stdio and HTTP transport.

![2025-07-31 at 22.49.57@2x.png](/images/2025-07-31-at-22.49.57-at-2x.png)

![2025-07-31 at 22.55.02@2x.png](/images/2025-07-31-at-22.55.02-at-2x.png)
![2025-07-31 at 22.57.10@2x.png](/images/2025-07-31-at-22.57.10-at-2x.png)
Once you've connected your tool you can test your tools/resources/prompts within the browser itself.

## Playground
You can use the playground feature to test the things like a actual usage. 

Out of box, it'll support Ollama models. And you can also bring in your own OpenAI or Anthropic keys as well.
![2025-07-31 at 23.02.06@2x.png](/images/2025-07-31-at-23.02.06-at-2x.png)
I really like this playground feature. And the UI looks so slick as well.

Happy testing MCP!