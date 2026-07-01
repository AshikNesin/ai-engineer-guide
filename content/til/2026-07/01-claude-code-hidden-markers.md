---
title: Claude Code's hidden markers
url: til/claude-code-hidden-markers
tags:
  - bookmark
status: published
date: 2026-07-01T00:00:00.000Z
qblog_id: d70102cd-156d-4544-912b-89da53633116
---

Thereallo has written an interesting blog post about how Claude Code adds subtle hidden markers in system prompt if you use **API base URL** (which matches [specific AI labs](https://cdn.thereallo.dev/blog/assets/cc-domains.js)) or from chinese **timezone** like Asia/Shanghai or Asia/Urumqi.

It essential becomes a prompt steganography where the data is hidden in plain sight.

If you're normal Claude Code user then your system prompt will have date like this
> Today's date is 2026-06-30.

However if those conditions are met then they change the following
- The apostrophe in Today's
- The date separator, from - to /

![2026-07-01-at-23.12.27.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/htio7bthp0iofzvrhrbb)

![2026-07-01-at-23.09.59.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/yolk1p72ulilslfwdtdi)

From Anthropic's side they claim it is to prevent `distillation attack` or the resellers which we're hearing a lot recently.

> CC silently alters the system prompt using invisible-ish Unicode markers. It encodes proxy / gateway classification into a sentence that looks like plain English. It hides the domain list behind XOR and base64. This is not a malicious feature, but it is a weird choice for a developer tool that asks for trust.

## Resource
- https://thereallo.dev/blog/claude-code-prompt-steganography#obfuscated-list