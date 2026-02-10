---
title: How to get detailed Claude Code Analytics using Sniffly
url: blog/claude-code-analytics-sniffly
tags:
  - claude-code
status: published
date: 2025-07-17T00:00:00.000Z
description: null
qblog_id: f6239691-f57e-46e9-9ae6-3364e8480da6
via_url: null
---

I got to know about [Sniffly](https://github.com/chiphuyen/sniffly?tab=readme-ov-file#with-uv-recommended) today.

It's **Claude Code Analytics** dashboard that you can run in your system which will give use the logs that were available in your local machine (`~/.claude`) to generate a detailed analytics of your usage.

Unlike [ccusage](/blog/claude-code-usage/), Sniffly gives you detailed analytics on your usage.

For example, you can:
- Project via cost split up
- Error distribution
- Interruption rate
- Tool usages

And much more 👉 https://x.com/chipro/status/1945527700808184115

And the best part is, it is open source 🌟

## How to run it get started?

Just run the following command. 

```shell
uvx sniffly@latest init
```

If uv is not available then you can install it via pip as well

```shell
pip install sniffly
sniffly init
```

Once you run the command, it'll start dev server. From there you should be able to access the dashboard.

Here are some of the screenshots when I ran it locally.

![2025-07-17 at 23.31.19.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-17-at-23.31.19.png)

![Pasted image 20250717232954.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/Pasted-image-20250717232954.png)

![Pasted image 20250717233011.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/Pasted-image-20250717233011.png)

![2025-07-17 at 23.30.38.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-17-at-23.30.38.png)

Happy Claude Analytics!
