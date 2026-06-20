---
title: Claimable Temporary Cloudflare Accounts for AI Agents
url: til/temporary-cloudflare-accounts-for-ai-agents
tags:
  - cloudflare
status: published
date: 2026-06-20T00:00:00.000Z
qblog_id: f2912844-90d4-40a3-8897-85b74e79eee8
---

Cloudflare now lets you create a temp accounts for AI Agents using which you can deploy Cloudflare workers (APIs), websites, etc.

Basically when you deploy something using `wrangler deploy --temporary` it'll create a temp account in Cloudflare where the app will be deployed. 

The app will be live for next 60 minutes and you'll also get a **claim url** using which you can make the app permanent.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/exsrzsqjzfy775ks1xhn)

A quick example that is writtern in their launch post

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/od8jkb7lmlnyfnrgjftj)

It redeploys in the same account + worker
![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/ug39nbm8vms1xtkktpzy)

And claiming is also straight forward like this

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/sqxpmal5edlogfgzyuvb)

I think, more and more apps will make the sign up flow for AI Agents easy. I hope [auth.md](https://workos.com/auth-md) gets more traction like MCP as well to make life simple for AI Agents and us  

## Reference
- https://blog.cloudflare.com/temporary-accounts/