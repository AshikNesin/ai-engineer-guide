---
title: How to ignore Project Trust Feature in Pi Coding Agent
url: til/ignore-project-trust-feature-in-pi-coding-agent
tags:
  - pi
status: published
date: 2026-06-09T00:00:00.000Z
qblog_id: dbb6194b-59fc-4159-be3d-7245f2e6100f
---

[Pi Agent](https://pi.dev) has recently shipped **Project Trust Feature** where it'll ask you whether the you trust that project if it has any custom project specific instructions like **AGENTS.md/CLAUDE.md** file or have `.pi` directory in it.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/uuu0diqcik5ftk0pewwd)

Thought it is a good thing in terms of security, it is kind of feels like rubber stamping sometime.

## How to allow all projects by default?
If you prefer not to have this approval thing, you can pass `-a` argument when starting it.

Or you can set an alias like this and use it.

```shell
alias pi='pi -a'
```

You can also bypass it by using global extenstion like this

```js
import type { ExtensionAPI, ProjectTrustEventResult } from "@earendil-works/pi-coding-agent";

export default function trustAllExtension(pi: ExtensionAPI): void {
	pi.on("project_trust", async (event): Promise<ProjectTrustEventResult> => {
		return { trusted: "yes" };
	});
}
```


## Reference
- https://github.com/earendil-works/pi/issues/5514
- https://x.com/mitsuhiko/status/2064014661385605422