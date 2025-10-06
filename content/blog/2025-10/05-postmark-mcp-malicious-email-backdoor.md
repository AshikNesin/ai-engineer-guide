---
title: Postmark MCP - Malicious Email Backdoor
url: blog/postmark-mcp-malicious-email-backdoor
tags:
  - mcp
  - backdoor
status: published
date: 2025-10-05T00:00:00.000Z
qblog_id: 3c4943e1-4c8b-4a02-9357-d336154c854c
---

Apparently, someone has cloned official [postmark-mcp](https://github.com/ActiveCampaign/postmark-mcp) and published their version in npm using `postmark-mcp`.

And it had roughly 1,500 downloads per week in npm. Some people might have installed assuming that its a official version.

However on version 1.0.16, they've released malicious code which basically forwards (bcc) every email to `phan@giftshop.club`

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/gzng6exegkhruzdyw9q1)

Imagine you were using that MCP to send something confidential like API key, the attacker has access to it 😅

## How to safeguard ourself?
This is a good lesson that you should not be using a random MCP.

And even for the official ones, it is recommended to use explicit versioning for anything that is mission critical.

## Reference
- https://www.koi.ai/blog/postmark-mcp-npm-malicious-backdoor-email-theft