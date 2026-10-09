---
title: AgentsInTheCloud - An Open-Source Agent You Can Run Anywhere
url: til/agents-in-the-cloud
tags:
  - cloud-agent
status: published
date: 2026-10-09T00:00:00.000Z
qblog_id: 0d8d4d5b-523d-4917-9e11-20b33b771190
---

I came across [AgentsInTheCloud](https://agentsinthecloud.com/). It lets you use your existing device like mac mini or VPS as a cloud agent.

And you can access it via browser on your Tailscale network.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I wanted:

- no lock-in to one AI lab
- cloud agents that can’t touch my laptop
- to stay connected to the code, even when I don’t write it by hand

For months I’ve done all my coding in a tool that does exactly that. Today I’m shipping it. It's free. 🧵
 https://t.co/elAbOh7fZ3</p>&mdash; Lucas Meijer (@lucasmeijer) <a href="https://x.com/lucasmeijer/status/2108248641605706006?ref_src=twsrc%5Etfw">October 8, 2026</a></blockquote>
<script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

Out of box, you get terminal, browser and IDE for each workspace. 

And everything runs securely so a agent can't go wrong and nuke your device. 

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-10/pmyhggsiupyr6i4sbou9)

I tried it for one of my project and it looks interesting.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-10/ukaorellxxibcno8uvn7)

## How to get started?

```shell
curl -fsSL https://agentsinthecloud.com/install.sh | bash
```

The above script will help you set it up almost instantly. You can choose to expose it via your tailscale network or not based on your requirement.

Make sure that you've docker installed and running as well.

## References
- https://github.com/lucasmeijer/AgentsInTheCloud/
