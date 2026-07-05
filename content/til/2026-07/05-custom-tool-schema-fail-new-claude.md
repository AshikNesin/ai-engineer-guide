---
title: Why Custom Tool Schema Fail on New Claude Models
url: til/custom-tool-schema-fail-new-claude
tags:
  - bookmark
status: published
date: 2026-07-05T00:00:00.000Z
qblog_id: 77e287ae-2ea8-4d7b-b3e2-9fbf016142d9
---

Armin Ronacher's recent blog post talks about trhe strange issue that he started noticing with new Claude LLM models like Opus 4.8.

Bascially, [Pi Agent](https://pi.dev) has edit tool which has `nested edits[] array` however Claude Code's edit tool call has flat shape like `file_path, old_string, new_string`.

And the new models started hallucinating random extra keys like `oldText2, requireUnique`, etc which doesn't exist in the schema - even in some cases the actual context was correct. 

## Reference
- https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/