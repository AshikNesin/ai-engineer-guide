---
title: OpenAI models supports 12-hour prompt caching in API
url: til/openai-12-hour-prompt-caching-api
tags:
  - openai
status: published
date: 2026-10-21T00:00:00.000Z
qblog_id: 36666c4d-a70b-4dab-bf16-1b76ff5b8aed
---

OpenAI models now supports 12-hour prompt caching in their API. So long running agents like OpenAI's Dots or other personal assistant which has a long running conversation don't ended up costing us more.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-10/mo93zj0xwc5evu28syzd)

And in terms of cost it's actually **2.5x of input token cost** (whereas 1.25× for "30m")


<blockquote class="twitter-tweet"><p lang="en" dir="ltr">You can choose “12h”, keep the 30-minute default, or mix both in one request: 12h for shared instructions, 30 minutes for newer conversation content.

If you need to reuse the same context throughout the day, savings from repeated reuse can significantly outweigh the extra cost of 12-hour caching.

https://t.co/1nCVCaAWmA</p>&mdash; OpenAI Developers (@OpenAIDevs) <a href="https://x.com/OpenAIDevs/status/2112603918522105890?ref_src=twsrc%5Etfw">October 20, 2026</a></blockquote>
<script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

## References
- https://developers.openai.com/api/docs/guides/prompt-caching
- https://developers.openai.com/api/docs/pricing?latest-pricing-expanded=true