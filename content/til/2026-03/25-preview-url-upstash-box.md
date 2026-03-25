---
title: How to get preview URL for Upstash Box Sandbox
url: til/preview-url-upstash-box
tags:
  - upstash-box
status: published
date: 2026-03-25T00:00:00.000Z
qblog_id: a9cd65e2-ca47-4496-9e4b-170060972333
---

[Upstash Box](https://aiengineerguide.com/til/upstash-box-serverless-sandbox/) allows you to execute dynamic code on the fly. It is really useful when running AI generated code securely.

And one interesting thing is that you can expose your server or something that you've created using it with it's preview url feature.

Here is an example on how to run a demo server and get a preview link for it.

```ts
import { Box } from "@upstash/box";
const box = await Box.create({
  runtime: "node",
  apiKey: process.env.UPSTASH_BOX_API_KEY,
});

await box.exec.command("npm install express");

await box.files.write({
  path: "server.js",
  content: `
 const express = require("express");
const app = express();
app.get("/", (req,res)=> {
res.send("It works!")
})
app.listen(3000)
  `,
});

const previewUrl = await box.getPreviewUrl(3000);

console.log(previewUrl);

await box.exec.command("node server.js");

```

![2026-03-25-at-23.24.402x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/a2296aagncz6uebwnafq)


![2026-03-25-at-23.20.292x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-03/bjhazyanff4i0kyjaxjm)

## Reference
- https://x.com/upstash/status/2036423822681706848