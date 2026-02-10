---
title: RAG vs Agentic RAG Explained Visually (with Diagram)
url: blog/rag-vs-agentic-rag
tags:
  - til
  - bookmark
  - define
status: published
date: 2025-06-30T00:00:00.000Z
description: null
qblog_id: e628b04f-882b-488a-b581-54b5474c0a05
via_url: https://blog.bytebytego.com/p/ep169-rag-vs-agentic-rag
---

Back in the days (early 2024-ish 😜), context window of LLM models were very limited like 4k, 8k, etc

In order to do something meaningful, we'll have to give proper context while keeping context window limit in the mind.

At that time, RAG (Retrieval Augmented Generation) had become common technique to achieve this.

In simple words, Here is how it works:
1. User asks a question
2. We search it against the vector database index (think of vector database as a special database in which we can search semantically)
3. Attach top 5 or 10 documents that matches the user query
4. LLM uses that context and generates the response

Drawbacks:
 - It's good for static sites like docs but not helpful in case if you're dealing with real time data.

**Agentic RAG** addresses that limitation.

TLDR: What is Agentic RAG?

**AI Agent + RAG = Agentic RAG**

The major difference with Agentic RAG and regular RAG is that, it has access to various tools like database, search engine API, memory, MCP servers, etc.


Here is a good comparison diagram by ByteByteGo 👇


![Pasted image 20250630215752.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/Pasted-image-20250630215752.png)

## Reference
- https://blog.bytebytego.com/p/ep169-rag-vs-agentic-rag

Happy Agentic RAG
