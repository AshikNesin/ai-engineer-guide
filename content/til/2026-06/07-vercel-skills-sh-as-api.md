---
title: Vercel's skills.sh as API within Vercel Projects
url: til/vercel-skills-sh-as-api
tags:
  - bookmark
status: published
date: 2026-06-07T00:00:00.000Z
qblog_id: c9d55731-7822-4545-bf62-489940492178
---

[skills.sh](https://www.skills.sh/) by Vercel which lists all the AI skills is now available as a API.

> Search for skills, pull detailed info on any one, check its security audit, and more.

However, you'll need to authenticate it with your Vercel project's [OIDC token](https://vercel.com/docs/oidc)

In terms of rate limit, they've 600 requests per min though.

## How to use it?
```js
import { getVercelOidcToken } from '@vercel/oidc';

export async function GET() {
  const token = await getVercelOidcToken();

  const res = await fetch('https://skills.sh/api/v1/skills', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return Response.json(await res.json());
}
```

## Reference
- https://vercel.com/changelog/the-skills-sh-api-is-now-available
- https://www.skills.sh/docs/api