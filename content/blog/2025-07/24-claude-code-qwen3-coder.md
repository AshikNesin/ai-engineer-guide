---
title: How to use Claude Code with Qwen3 Coder
url: blog/claude-code-qwen3-coder
tags:
  - til
  - claude-code
  - qwen3-coder
status: published
date: 2025-07-24T00:00:00.000Z
description: null
qblog_id: ab0b854a-5ed5-4315-ad1f-8915d679aed1
via_url: null
---

Alibaba team has recently released [Qwen3-Coder](https://qwenlm.github.io/blog/qwen3-coder/) which claims to do better in coding. Based on the benchmark it is in the range of Claude 4 in term of accuracy.

Let's see how to use this model with Claude Code.

First, you'll need to get API key from  [Alibaba Cloud Model Studio](https://modelstudio.console.alibabacloud.com/) 

If you don't have claude code installed in your machine before then install it 

```bash
npm install -g @anthropic-ai/claude-code
```

Once you've that, then set these in env variables
```shell
export ANTHROPIC_BASE_URL=https://dashscope-intl.aliyuncs.com/api/v2/apps/claude-code-proxy
export ANTHROPIC_AUTH_TOKEN=your-api-key
```

That's pretty much it. You should be using Claude Code with Qwen3-Coder.

## References
[Qwen3-Coder: Agentic Coding in the World | Qwen](https://qwenlm.github.io/blog/qwen3-coder/)

Happy terminal coding!