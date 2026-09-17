---
title: Install skills directly from Notion page
url: til/skills-cli-notion-url
tags:
  - bookmark
status: published
date: 2026-09-17T00:00:00.000Z
qblog_id: 443b635a-d09e-4ecc-9f58-92cb53ebcf87
---

`skills` cli now supports directly installing via notion url.

No need to worry about having to commit your skills to github and things like that.

This notion based approach will be useful for non tech folks!

## How to use it?

```shell
𝚗𝚙𝚡 𝚜𝚔𝚒𝚕𝚕𝚜 𝚊𝚍𝚍 <𝚗𝚘𝚝𝚒𝚘𝚗-𝚞𝚛𝚕>
```

Under the hood it'll use notion cli. If you don't have it installed already you can do it using this command

```shell
curl -fsSL https://ntn.dev | bash
ntn login
```

## Reference
- https://vercel.com/changelog/skills-cli-notion-skills
