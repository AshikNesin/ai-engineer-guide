---
title: Anthropic Claude Haiku 4.5
url: blog/anthropic-claude-haiku-4-5
tags:
  - anthropic
  - claude-haiku-4-5
status: published
date: 2025-10-16T00:00:00.000Z
qblog_id: 6575c2fe-09a0-4f29-becd-69e619d888fe
---

Anthropic has released Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) their latest **small model** which is good for **low-latency tasks** where you need speed/cost more than being accurate.

In terms of benchmark it is as good as Claude Sonnet 4.
![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/uvdcqiiza7js6lniyv9b)

Based on the benchmark, it looks like good for **agentic use case** where this model is used as sub-agent in combination with an orchestrator model like Sonnet 4.5.

And here is the comparison between other models
![2025-10-16-at-22.57.422x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/wnlcyze1jk9fzusjws6g)

The pricing is more than old Haiku (but I guess they increased it because of intelligence?)

| Token Type | Price per million |
|------------|-------------------|
| Input      | $1                |
| Output     | $5                |

Sam Witteveen has a high level walk through of this model in his recent video 👇
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/lrf8eE-ADiw?si=Mehr2Hjl1KgJSyxj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Reference
- [https://www.anthropic.com/news/claude-haiku-4-5](https://www.anthropic.com/news/claude-haiku-4-5)
- [https://x.com/alexalbert__/status/1978506520355864813](https://x.com/alexalbert__/status/1978506520355864813)
- [https://docs.claude.com/en/docs/about-claude/models/overview#model-comparison-table](https://docs.claude.com/en/docs/about-claude/models/overview#model-comparison-table)