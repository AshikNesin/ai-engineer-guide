---
title: Official MCP Registry by Anthropic
url: blog/official-mcp-registry-by-anthropic
tags:
  - mcp
  - anthropic
status: published
date: 2025-09-10T00:00:00.000Z
qblog_id: a36b2ab4-5d01-4a60-ae14-bf2cb87b1f56
---

Anthropic has now officially launched MCP Registry.

The registry will MCP servers to improve discoverability.

You can think of MCP as what npm is for JavaScript/Node projects.

## Single source of truth for MCP servers
Until now, there are 100s of unofficial registries for MCP. (In fact, there is a registry for registry as well 😅)

We had to manually get ourselves added in most of them. And also those registory might not hold creditabolity as well.

But now with the official registry, we don't have to worry about it. As long as we get our MCP added to the official registry, it will most probably be added to the unofficial registry (if they decide to use official registry data)

Instead of us getting ourselves registered in 100s of MCP registries, getting into the official registry would make our lives simple for us.

## Getting Started
### 1. Adding your server
#### Prerequisites
- Make sure your MCP servers are published in a package registry like npm, PyPI, Docker Hub, etc

#### Install Publisher CLI

```bash
brew install mcp-publisher
```
Once you've installed the CLI, you need to `init` it in your MCP server package.

#### Initialise Your server.json file
You can do so by running
```bash
mcp-publisher init
```

It'll create `server.json` with auto-detected values.
```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json",
  "name": "io.github.yourname/your-server",
  "description": "A description of your MCP server",
  "version": "1.0.0",
  "packages": [
    {
      "registry_type": "npm",
      "identifier": "your-package-name",
      "version": "1.0.0"
    }
  ]
}
```

In the server.json file, there will be a `name` field which will act as a kind of like a namespace.

Right now, you can have either `github` or your own domain.

- `io.github.yourname/*` - Requires GitHub authentication
- `com.yourcompany/*` - Requires DNS or HTTP domain verification

#### Package Validation
Your package must also include the validation metadata to prove ownership.

For example, in case your MCP is a NPM package, you'll need to add the `mcpName` in your `package.json` as mentioned in the server.json

Example:
```json
{
  "name": "your-npm-package",
  "version": "1.0.0",
  "mcpName": "io.github.username/server-name"
}
```

You can learn more about authentication, publishing the package, security, etc [here](https://github.com/modelcontextprotocol/registry/blob/main/docs/guides/publishing/publish-server.md)

### 2. Accessing MCP Server data

You can access the MCP server-related things in the following endpoints.

**Base URL**: `https://registry.modelcontextprotocol.io/v0/servers`

### Server Endpoints

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/v0/servers`      | List all servers with pagination |
| GET    | `/v0/servers/{id}` | Get server details by UUID       |

![2025-09-10-at-22.53.532x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/m7j1bjwymr3edzycgvzd)

You can play around with their [interactive API docs](https://registry.modelcontextprotocol.io/docs#/) as well
![2025-09-10-at-22.57.472x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/u7yjhn7ytsznrwzbspt2)

You can use this information to build your own sub-registry with enhanced data.

Or you could be AI Coding tool which has a support for MCP tools and you want to provider a frictionless way for your users to install the MCP.

## Reference
- [Introducing the MCP Registry | mcp blog](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)

Happy listing MCPs!