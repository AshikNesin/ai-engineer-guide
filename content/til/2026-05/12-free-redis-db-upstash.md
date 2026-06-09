---
title: Create Free Redis databases for AI Agents using Upstash
url: til/free-redis-db-upstash
tags:
  - tools
status: published
date: 2026-05-12T00:00:00.000Z
qblog_id: 22c81b02-a6fa-431d-b180-7fc6686a21da
---

Upstash now lets you create a temp redis db using AI agents like Claude Code, Codex, etc

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-05/jkdz7kxfp8y3c5bs0k8b.mp4" >}}

You just need to mention the url when asking it to create redis db

👉 https://upstash.com/start-redis

When you access that file, you'll have these prompts

```markdown
# Upstash Redis for Agents

A zero-config Redis database for AI agents — no signup, no UI.

To create a database, generate a fresh UUIDv4 and POST it as the
`Idempotency-Key` header:

  curl -X POST -H "Idempotency-Key: <uuidv4>" https://upstash.com/start-redis

The UUIDv4 you send becomes the database id. POSTing again with the
same UUID returns the same database (retry-safe, also useful for
re-fetching credentials).

The header is optional: omitting it mints a new database with a
server-generated id (returned in the response — you can re-fetch
later by passing that id back as the Idempotency-Key). Sending your
own UUID is still recommended because it makes the *first* call
retry-safe — if the response is lost, retrying with the same UUID
returns the same database instead of creating a duplicate. Only
UUIDv4 is accepted.

The response is markdown with credentials, an inline quickstart, and
a console URL the agent can share with the user (where they view
usage and click Claim to keep the database).

Databases live for 3 days unless claimed.

## Install as a skill

To install this as a reusable skill, run:

  npx ctx7 skills install /upstash/skills upstash-redis-start

Skill source: https://github.com/upstash/skills/blob/main/skills/upstash-redis-start/SKILL.md
```

## Reference
- https://xcancel.com/upstash/status/2054235782148186301#m