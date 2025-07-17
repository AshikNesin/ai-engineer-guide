---
title: How to get detailed Claude Code Analytics using Sniffly
date: 2025-07-17
description: 
tags:
  - claude-code
url: blog/claude-code-analytics-sniffly
via_url:
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
![2025-07-17 at 23.02.56@2x.png](/images/2025-07-17-at-23.02.56-at-2x.png)
![2025-07-17 at 23.14.11@2x.png](/images/2025-07-17-at-23.14.11-at-2x.png)
![2025-07-17 at 23.14.32@2x.png](/images/2025-07-17-at-23.14.32-at-2x.png)
![2025-07-17 at 23.14.49@2x.png](/images/2025-07-17-at-23.14.49-at-2x.png)
Happy Claude Analytics!