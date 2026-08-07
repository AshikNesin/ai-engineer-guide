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

So basically, you're allowed to use LLM to learn from the codebase, do code reviews privately and things like that. But LLM output isn't allowed in public docs, PR descriptions, or GH comments unless it's explictly mentioned.

And reviewers aren't required to look at the LLM PRs if they don't want to do it.

## Reference
- https://blog.rust-lang.org/inside-rust/2026/08/05/rust-langrust-is-adopting-an-llm-policy/
- https://forge.rust-lang.org/policies/llm-usage.html