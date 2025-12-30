---
title: How Lee Robinson used AI Agents to Build Pixo - Image Compressor
url: blog/lee-robinson-built-pixo-image-compressor
tags:
  - case-study
  - lee-robinson
status: published
date: 2025-12-30T00:00:00.000Z
qblog_id: c1c861a1-a01c-462f-96a4-1b95122e7261
---

Lee Robinson has built a image compression app in Rust with zero depedency completely from scratch with AI agents.

It runs on web (client side app) that runs entirely in the browser using WebAssembly.

👉 https://leerob.com/pixo

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I built a Rust-based image compressor, WASM binary, and SvelteKit app!<br><br>I wanted to see how far I could go using only coding agents.<br><br>I did not write any code by hand.<br><br>After 520 agents, 350M tokens, and $287 I can now say… extremely far.<a href="https://t.co/yxFL20j0PF">https://t.co/yxFL20j0PF</a> <a href="https://t.co/ftCzxvbXNE">pic.twitter.com/ftCzxvbXNE</a></p>&mdash; Lee Robinson (@leerob) <a href="https://twitter.com/leerob/status/2005700621463330888?ref_src=twsrc%5Etfw">December 29, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The entire project is built using AI Agents in Cursor primarily using Opus 4.5 & GPT 5.1 Codex Max models and have extensively used planning mode that is available in Cursor.

Overall, it has generated 38,000+ lines of Rust code, tests, etc 

So the goal for him is to see if AI can be used for low level apps like this which involves compression algorithms, etc.

You can play around with the app here:

https://pixo.leerob.com

## Reference
https://leerob.com/pixo