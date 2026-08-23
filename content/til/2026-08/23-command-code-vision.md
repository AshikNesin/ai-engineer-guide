---
title: How Command Code handles Image Understanding for non-vision LLMs
url: til/command-code-vision
tags:
  - command-code
status: published
date: 2026-08-23T00:00:00.000Z
qblog_id: d32ac34e-7f26-428c-988b-7fe2942307e2
---

Not all the models has vision/image understanding support. So command code handles it with `vision` tool.

Basically, if a LLM supports image natively then it'll use it. If not, it'll invoke the `vision` tool to get the needed context using a cheap model then pass the result back to the parent model.

![2026-08-23-at-11.53.152x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-08/tsjszspqbtkiky0yqspn)

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-08/wuks8dcwrz0v8r0aaj0c.mp4" >}}

And here is a video walkthrough of how it works by Ahmad (CEO of Command Code)

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">every model in Command Code has vision, DeepSeek too! <a href="https://t.co/pu7SDSXTKA">pic.twitter.com/pu7SDSXTKA</a></p>&mdash; Ahmad Awais (@MrAhmadAwais) <a href="https://x.com/MrAhmadAwais/status/2090786001740324990?ref_src=twsrc%5Etfw">August 21, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>


## Reference
- https://commandcode.ai/docs/vision