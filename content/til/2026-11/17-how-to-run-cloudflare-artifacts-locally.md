---
title: How to run Cloudflare Artifacts Locally
url: til/how-to-run-cloudflare-artifacts-locally
tags:
  - bookmark
status: published
date: 2026-11-17T00:00:00.000Z
noindex: true
qblog_id: a5cb692b-2c1c-443a-8417-c20e7b206964
---

[Cloudflare Artifacts](https://www.cloudflare.com/products/artifacts/) can now be ran locally.

Local artifacts emits the same [events](https://developers.cloudflare.com/artifacts/guides/event-subscriptions/) as in production as well.

To get started, we need to add the bindings to your wrangler config

```yaml
# wrangler.toml
name = "artifacts-worker"
main = "src/index.ts"
# Set this to today's date
compatibility_date = "2026-11-17"

[[artifacts]]
binding = "ARTIFACTS"
namespace = "default"
```

Then you can start dev `npx wrangler dev`

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-11/mje3n7cwfxlnrhlrxy0q)

And you can start using like this

```js
const created = await env.ARTIFACTS.create("starter-repo");

return Response.json({
	remote: created.remote,
	token: created.token,
});
```

## Reference
- https://developers.cloudflare.com/changelog/post/2026-11-16-local-artifacts-development/