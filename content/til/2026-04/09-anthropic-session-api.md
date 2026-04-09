---
title: Anthropic Session API
url: til/anthropic-session-api
tags:
  - anthropic
status: published
date: 2026-04-09T00:00:00.000Z
qblog_id: 067c0265-75a3-4443-9b97-6398a1e77150
---

Anthropic platform now of support session an API, it is similar to OpenAI's assistant which is now deprecated.

> A session is a running agent instance within an environment. Each session references an agent and an environment (both created separately), and maintains conversation history across multiple interactions.

Basically, by using this feature you don't have to worry about managing the history of the conversation, working with files, out of box support for observability, etc

👉 https://platform.claude.com/docs/en/managed-agents/sessions

## How to use it?

First thing is that you need to create a new [agent](https://platform.claude.com/docs/en/managed-agents/agent-setup) and [environment](https://platform.claude.com/docs/en/managed-agents/environments)

```bash
agent=$(curl -fsSL https://api.anthropic.com/v1/agents \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "Coding Assistant",
    "model": "claude-sonnet-4-6",
    "system": "You are a helpful coding agent.",
    "tools": [{"type": "agent_toolset_20260401"}]
  }')

AGENT_ID=$(jq -r '.id' <<< "$agent")
```

In response, you'll have `id` and other things like this

```json
{
  "id": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
  "type": "agent",
  "name": "Coding Assistant",
  "model": {
    "id": "claude-sonnet-4-6",
    "speed": "standard"
  },
  "system": "You are a helpful coding agent.",
  "description": null,
  "tools": [
    {
      "type": "agent_toolset_20260401",
      "default_config": {
        "permission_policy": { "type": "always_allow" }
      }
    }
  ],
  "skills": [],
  "mcp_servers": [],
  "metadata": {},
  "version": 1,
  "created_at": "2026-04-03T18:24:10.412Z",
  "updated_at": "2026-04-03T18:24:10.412Z",
  "archived_at": null
}
```

Similarly, we need to create env like this

```bash
environment=$(curl -fsS https://api.anthropic.com/v1/environments \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  --data @- <<'EOF'
{
  "name": "python-dev",
  "config": {
    "type": "cloud",
    "networking": {"type": "unrestricted"}
  }
}
EOF
)
environment_id=$(jq -r '.id' <<< "$environment")

echo "Environment ID: $environment_id"
```

## Creating Session & Start Session
With the agent id and environment id, we'll create a new session

```shell
session=$(curl -fsSL https://api.anthropic.com/v1/sessions \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- <<EOF
{
  "agent": "$AGENT_ID",
  "environment_id": "$ENVIRONMENT_ID"
}
EOF
)
SESSION_ID=$(jq -r '.id' <<< "$session")
```

Once the session is created, just start it

```shell
curl -fsSL "https://api.anthropic.com/v1/sessions/$SESSION_ID/events" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- <<'EOF'
{
  "events": [
    {
      "type": "user.message",
      "content": [{"type": "text", "text": "List the files in the working directory."}]
    }
  ]
}
EOF
```

This feature is really helpful, if you just want to get things done and don't need any granular level control.

And beware of vendor locking as well.




