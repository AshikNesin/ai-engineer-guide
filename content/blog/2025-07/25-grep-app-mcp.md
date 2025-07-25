---
title: How to Search GitHub Public Repo with Grep MCP
date: 2025-07-25
description: 
tags:
  - TIL
  - grep-app
url: blog/grep-app-mcp
via_url: https://vercel.com/blog/grep-a-million-github-repositories-via-mcp
---
[Grep](https://grep.app/) allows you to search **code** across a million GitHub public repo. 

And the search is really fast. You get the result within a second.

Even in GitHub it takes more time than that.

I usually use this tool to have a look at how others are using particular feature/method from library. 

Now they support Remote MCP which can be accessed here

```
https://mcp.grep.app
```

## How to setup?

### Claude Code

```shell
claude mcp add --transport http grep https://mcp.grep.app
```

### Cursor
```json
{
  "mcpServers": {
    "grep": {
      "url": "https://mcp.grep.app"
    }
  }
}
```

## References
- [Grep a million GitHub repositories via MCP - Vercel](https://vercel.com/blog/grep-a-million-github-repositories-via-mcp#with-claude-code:)

Happy searching code!