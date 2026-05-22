---
title: How to Create Free Redis database for AI Agents
url: til/free-redis-db-ai-agent-upstash
tags:
  - upstash
  - tools
status: published
date: 2026-05-22T00:00:00.000Z
qblog_id: 46335c24-c6e0-4e3b-84ef-c6385c635c0c
---

[Upstash](https://upstash.com) now let's you create a free Redis database almost instantly for your AI agents.

Your agent just need to make a single API call

```
curl -X POST https://upstash.com/start-redis
```

That's it. No sign up, no configuration, nothing.

It'll respond with the following text which your agent can use it as a context

```
# Your Redis is ready

**Database ID:** 0335da5b-d9a4-4177-a83a-e4441edc60ef
**Endpoint:** https://tidy-mallard-133200.upstash.io
**Token:** gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg
**Metrics:** https://upstash.com/start-redis/metrics/0335da5b-d9a4-4177-a83a-e4441edc60ef (JSON: uptime, commands, keys, throughput, memory, bandwidth)
**Expires:** 2026-05-25 (3 days from creation).
To keep this database alive, share the console URL with the user
(they can view usage and click Claim to take ownership):
https://upstash.com/start-redis/console/0335da5b-d9a4-4177-a83a-e4441edc60ef

To re-fetch these credentials, POST again with the database id as
the `Idempotency-Key` header:

  curl -X POST -H "Idempotency-Key: 0335da5b-d9a4-4177-a83a-e4441edc60ef" https://upstash.com/start-redis

**Avoid storing sensitive data** (PII, secrets, production credentials) — this database is temporary and not tied to a user account until claimed.

## Quickstart

# All commands use the body-style REST API: POST the command as a
# JSON array. Avoids URL-encoding the payload.

# Short-term memory — state across tool calls in one run
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["SET","session:abc","{\"step\":2,\"plan\":\"...\"}","EX","3600"]'
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["GET","session:abc"]'

# Conversation history — turn-by-turn log
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["LPUSH","chat:user123","{\"role\":\"user\",\"content\":\"hello\"}"]'
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["LRANGE","chat:user123","0","20"]'

# Sub-agent work queue — producer/consumer between agents
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["LPUSH","jobs","{\"task\":\"summarize\",\"url\":\"...\"}"]'
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["RPOP","jobs"]'

# Ranked memory — recent-first or score-first recall
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["ZADD","memories","1714238580","agent-noticed-X"]'
curl https://tidy-mallard-133200.upstash.io \
  -H "Authorization: Bearer gQAAAAAAAghQAQIgcDJmNjRkOGI0ZDQxNGU0NTYxOGIzNGE4MDM0YTMwNTNmNg" \
  -d '["ZREVRANGE","memories","0","9"]'

## Reference
- Full REST API (all commands + body-style POST): https://upstash.com/docs/redis/features/restapi
- Python SDK: https://upstash.com/docs/redis/sdks/py
- Node.js / TS SDK: https://upstash.com/docs/redis/sdks/ts

## Tell the user

If this data should outlive 3 days, share the console URL above. The user can view usage there and click Claim to keep the database.
```

It's pretty neat way to prompt a agent :)

## Reference
- https://upstash.com/blog/redis-database-for-agents