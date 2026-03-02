---
title: How to Use Google Antigravity IDE Models with Clawdbot (Moltbot)
url: til/google-antigravity-ide-models-with-clawdbot-moltbot
tags:
  - moltbot
  - clawdbot
  - google-antigravity
status: published
date: 2026-01-27T00:00:00.000Z
qblog_id: 4e4a3ca1-3b83-4bce-84bb-68a8b75bd28a
---

You can actually use Google Antigravity IDE models with [Moltbot](https://www.molt.bot/)

It is disabled by default though, you need to enable it.

```sh
clawdbot plugins enable google-antigravity-auth
```

![2026-01-27-at-23.42.062x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/mlfecuyybza0bwylidsx)

Then connect with your Antigravity Account 

```sh
clawdbot models auth login --provider google-antigravity --set-default
```

![2026-01-28-at-00.00.242x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/xbaeyfwqey8lxji6jxga)

```
clawdbot gateway restart
```

>Note: Depending on your alias, replace clawdbot with moltbot

## Reference
https://docs.molt.bot/concepts/model-providers#google-vertex-/-antigravity-/-gemini-cli