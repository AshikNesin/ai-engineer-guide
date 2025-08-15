---
title: use-mcp - A Lightweight React Hook for Integrating with MCP Servers
date: 2025-06-20
description: 
tags:
  - bookmark
  - react
url: blog/use-mcp-react-hook
via_url: https://blog.cloudflare.com/connect-any-react-application-to-an-mcp-server-in-three-lines-of-code/
---
Along with [LLM Playground](https://playground.ai.cloudflare.com/), Cloudflare has open sourced [use-mcp](https://github.com/modelcontextprotocol/use-mcp) - a lightweight React hook for connecting with remote MCP servers.

This will be useful if you're building a playground for remote MCP servers.

It takes care of lot of things out of box:
- Automatic connection management with reconnection and retries
- OAuth auth support
- Logging for debugging
- Support for HTTP & SSE transports

## Installation
```shell
npm install use-mcp
# or
pnpm add use-mcp
# or
yarn add use-mcp
```

## Example snippet
```jsx
import { useMcp } from 'use-mcp/react'

function MyAIComponent() {
  const {
    state,          // Connection state: 'discovering' | 'authenticating' | 'connecting' | 'loading' | 'ready' | 'failed'
    tools,          // Available tools from MCP server
    error,          // Error message if connection failed
    callTool,       // Function to call tools on the MCP server
    retry,          // Retry connection manually
    authenticate,   // Manually trigger authentication
    clearStorage,   // Clear stored tokens and credentials
  } = useMcp({
    url: 'https://your-mcp-server.com',
    clientName: 'My App',
    autoReconnect: true,
  })

  // Handle different states
  if (state === 'failed') {
    return (
      <div>
        <p>Connection failed: {error}</p>
        <button onClick={retry}>Retry</button>
        <button onClick={authenticate}>Authenticate Manually</button>
      </div>
    )
  }

  if (state !== 'ready') {
    return <div>Connecting to AI service...</div>
  }

  // Use available tools
  const handleSearch = async () => {
    try {
      const result = await callTool('search', { query: 'example search' })
      console.log('Search results:', result)
    } catch (err) {
      console.error('Tool call failed:', err)
    }
  }

  return (
    <div>
      <h2>Available Tools: {tools.length}</h2>
      <ul>
        {tools.map(tool => (
          <li key={tool.name}>{tool.name}</li>
        ))}
      </ul>
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}
```

Here is an [example](https://inspector.use-mcp.dev/) of showcasing the capabilities of use-mcp 👇
![2025-06-20 at 21.49.38@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-06-20-at-21.49.38-at-2x.png)

## Source Code
- https://github.com/modelcontextprotocol/use-mcp (MIT)
## References
- https://blog.cloudflare.com/connect-any-react-application-to-an-mcp-server-in-three-lines-of-code/

Happy building apps!
