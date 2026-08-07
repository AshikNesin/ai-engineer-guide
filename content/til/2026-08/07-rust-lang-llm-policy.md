---
title: Rust Language's LLM Policy
url: til/rust-lang-llm-policy
tags:
  - how-to-use-llm
  - rust
status: published
date: 2026-08-07T00:00:00.000Z
qblog_id: 814abf36-17b8-403f-a464-96aa3ebc592d
---

Rust language team has published their LLM policy. Here are some of the they highlights

> It's fine to use LLMs to answer questions, analyze, distill, refine, check, suggest, review. But not to **create**.

So what's allowed?

Any use of an LLM where you are the **only one who sees the output**. 

> LLM output isn't allowed in public docs, PR descriptions, or Github comments unless it's clearly marked; reviewers aren't required to look at LLM PRs if they don't want to.

## Reference
- https://blog.rust-lang.org/inside-rust/2026/08/05/rust-langrust-is-adopting-an-llm-policy/
- https://forge.rust-lang.org/policies/llm-usage.html