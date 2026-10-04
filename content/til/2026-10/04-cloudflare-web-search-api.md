---
title: Cloudflare Web Search API
url: til/cloudflare-web-search-api
tags:
  - bookmark
status: published
date: 2026-10-04T00:00:00.000Z
qblog_id: 1cacd596-f740-4e8d-a718-3d973ec7d398
---

Cloudflare now has support for web search through their AI gateway.

Right now it uses the following providers under the hood like Exa, Ceramic, Linkup with zero data retention.

You can make request like this

```shell
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/websearch/ \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "query": "What is the latest model from OpenAI for coding?",
    "provider": "ceramic",
    "limit": 5,
    "options": { "gateway": { "id": "default" } }
  }'
```


## Reference
https://developers.cloudflare.com/changelog/post/2026-10-02-introducing-web-search-api/