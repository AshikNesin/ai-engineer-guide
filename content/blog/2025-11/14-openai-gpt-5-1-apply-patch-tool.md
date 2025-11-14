---
title: OpenAI's GPT-5.1 apply_patch Tool for Code Edits
url: blog/openai-gpt-5-1-apply-patch-tool
tags:
  - openai
status: published
date: 2025-11-14T00:00:00.000Z
qblog_id: f1f8657a-131e-4ab5-8b14-1ae854bdbae0
---

OpenAI's latest model family GPT-5.1 has a new built‑in tools include an **apply_patch** that helps to edit free-form code edits.

>The freeform apply_patch tool lets GPT‑5.1 create, update, and delete files in a codebase using structured diffs. Instead of just suggesting edits, the model emits patch operations that an application applies and reports back on, enabling iterative, multi-step code editing workflows.

![2025-11-14-at-23.14.462x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/iqvfbjv8waiul4mfk658)

It works only in responses API alone. But overall it looks good.

## Reference
- https://openai.com/index/gpt-5-1-for-developers/
- https://platform.openai.com/docs/guides/tools-apply-patch