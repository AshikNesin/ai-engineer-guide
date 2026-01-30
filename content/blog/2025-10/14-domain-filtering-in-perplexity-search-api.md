---
title: Domain filtering in Perplexity Search API
url: blog/domain-filtering-in-perplexity-search-api
tags:
  - perplexity-ai
  - search-api
status: published
date: 2025-10-14T00:00:00.000Z
qblog_id: 108cbdcb-00bd-4c13-8039-bc79bbb75bf0
---

Perplexity Search API now has support for domain filtering using which we can get content only from a **specific domain**.

All we need to do use pass the domains in `search_domain_filter` parameter (max 20 domains).

## Example Snippet
```shell
curl -X POST 'https://api.perplexity.ai/search' \
  -H 'Authorization: Bearer $PERPLEXITY_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "prompt engineering",
    "search_domain_filter": [
      "aiengineerguide.com"
    ],
    "max_results": 1
  }' | jq
```
And we'll be getting the response like this:
```json
{
  "results": [
    {
      "title": "Prompt Engineering 101 by Anthropic - AI Engineer Guide",
      "url": "https://aiengineerguide.com/blog/prompt-engineering-101-by-anthropic/",
      "snippet": "# Prompt Engineering 101 by Anthropic\n\nI came across the prompt engineering tips by the Anthropic team 👇\n\nI especially like the prompt structure tips\n\nHappy learning AI!\n\nI came across the prompt engineering tips by the Anthropic team 👇\n\nI especially like the prompt structure tips\n\nHappy learning AI!",
      "date": "2025-08-23",
      "last_updated": "2025-08-29"
    }
  ],
  "id": "3ff7e1c1-3f2d-4287-b448-b90f405c2c0e",
  "server_time": null
}
```

Make sure to that you create a new API key else you'll be facing the following error.
```json
{
  "error": {
    "message": "This endpoint requires a new API key. Create one at: https://www.perplexity.ai/account/api/keys",
    "type": "api_key_created_before_search_api_cutoff",
    "code": 451
  }
}
```

## Reference
- [https://x.com/PPLXDevs/status/1977778640566808620](https://x.com/PPLXDevs/status/1977778640566808620)
- [https://docs.perplexity.ai/guides/search-quickstart#domain-filtering](https://docs.perplexity.ai/guides/search-quickstart#domain-filtering)

Happy instant searching!