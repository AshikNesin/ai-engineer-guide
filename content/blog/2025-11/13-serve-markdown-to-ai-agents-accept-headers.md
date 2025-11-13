---
title: How to serve Markdown instead of HTML for AI Agents
url: blog/serve-markdown-to-ai-agents-accept-headers
tags:
  - claude-code
  - ai-agents
status: published
date: 2025-11-13T00:00:00.000Z
qblog_id: de6fddf7-baff-4dd4-9b9d-8752c5fc69e0
---

[Bun.sh](https://bun.sh) team follows a really interesting technique to make their docs LLM friendly.

Basically, when a AI agent (claude code in this case) fetches their docs they reply with markdown instead of HTML.

They claim that this approach reduces token usage by 10x. And yeah, we all know that LLMs are really good with markdown.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">When Claude Code fetches Bun’s docs, Bun’s docs now send markdown instead of HTML by default <br><br>This shrinks token usage for our docs by about 10x <a href="https://t.co/cvasTo6h43">pic.twitter.com/cvasTo6h43</a></p>&mdash; Bun (@bunjavascript) <a href="https://twitter.com/bunjavascript/status/1971934734940098971?ref_src=twsrc%5Etfw">September 27, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## How does it work?
AI Agents don't include **text/html** in their [Accept header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept).

For example, when fetching a URL, Claude Code sends a custom `Accept` header

Instead of the default, `*/*` they send `application/json, text/plain, */*`

![2025-11-13-at-23.02.352x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/qtacof110kpbhknjsq4i)

And Bun team uses this to identify the request and serve the content accordingly.

For example, this is the response that we get if we try to fetch a [doc](https://bun.sh/docs/runtime/file-types)

![2025-11-13-at-23.02.162x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/d87to4i6na601crpfkps)

And by sending `Accept: application/json, text/plain, */*` header, we're getting markdown.

![2025-11-13-at-23.03.572x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/ux5za81i2p9jr3khtdlz)

## What's next?
And Claude Code team claims that they'll start sending `Accept: “text/markdown"` then making a request in the upcoming versions.

## Reference
- https://x.com/bcherny/status/1988860326306087102
- https://x.com/bunjavascript/status/1971934734940098971

Happy optimizing docs!