---
title: Zed uses Weighted BM25 for MCP Tool Search
url: til/zed-mcp-tool-search-bm25
tags:
  - bookmark
status: published
date: 2026-10-22T00:00:00.000Z
qblog_id: 424ecac1-fd0f-4aeb-ad46-10190388e0fb
---

Apparently [Zed](https://zed.dev) uses BM25 for MCP tool search and as per their benchmark it had performed better than other approaches like LLMs, embeddings and decision models like Jev.

> We settled on weighted BM25 with a few normalization rules. Fast, local, no model or API calls.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-10/upzrkgxi4vyxjleerrhi)

So far there is no technical article about it though. So we don't know how they arrived at this decision (yet?)

## Reference
https://x.com/zeddotdev/status/2112588120558338261
