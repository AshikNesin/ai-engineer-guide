---
title: Budget for Claude Managed Agents session
url: til/claude-managed-agents-session-budget
tags:
  - claude
status: published
date: 2026-08-08T00:00:00.000Z
qblog_id: c6fa9a68-2b4b-4026-a9d2-93db1aaaac4b
---

For Claude Managed Agents, you now set budget at session level

```py
session=$(curl -fsSL https://api.anthropic.com/v1/sessions \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- <<EOF
{
  "agent": "$AGENT_ID",
  "environment_id": "$ENVIRONMENT_ID",
  "budget": {
    "type": "limit",
    "max_list_cost": {"amount": "2500", "currency": "USD"}
  }
}
EOF
)
SESSION_ID=$(jq -r '.id' <<< "$session")
```

When creating a session, pass `budget` with `type=limit` and `max_list_cost.amount` in cents.

## Reference
- https://x.com/ClaudeDevs/status/2085853169930957158
- https://platform.claude.com/docs/en/managed-agents/budgets