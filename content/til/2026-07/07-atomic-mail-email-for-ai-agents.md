---
title: Atomic Mail - Free Email Account for AI Agents
url: til/atomic-mail-email-for-ai-agents
tags:
  - tools
status: published
date: 2026-07-07T00:00:00.000Z
qblog_id: 5f1a5bc5-a9ac-447d-a812-f50aba2a7a5b
---

If you wanted to give a dedicated email ID for your AI agents, then [Atomic Email](https://atomicmail.io/agents) might be a good choice.

It is launched recently so I wouldn't recommend for anything production but this app seems to be a good option for non-critical things.

The one thing that I really like about this is that unlike other providers, they have a first-class support for JMAP protocol.

## How to get started?
Just tell your AI agents like OpenClaw to register for itself. 

Here is a prompt that you need to send to get started.

```shell
# Register
npx --package=@atomicmail/agent-skill atomicmail register --username "myagent"

# Send a JMAP request inline
npx --package=@atomicmail/agent-skill atomicmail jmap_request \
  --ops '[["Mailbox/get", {"accountId": "$ACCOUNT_ID"}, "m0"]]'

# Send a JMAP request from a preset file
npx --package=@atomicmail/agent-skill atomicmail jmap_request --ops-file send_mail.json

# Ask for help
npx --package=@atomicmail/agent-skill atomicmail help
```

I really like the signup flow. 

You don't need to create an account manually. You just need to send the above prompt and your AI agent will take care of rest, and it will get a dedicated email like this.

{{< video "https://cdn.qblog.nesin.io/qblog/AIEngineerGuide/2026-07/odfrs7azu6nv1ri4ogtc.mp4" >}}


![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/vcsvus6que8o98grxgth)

That's pretty much it.

Now your agent can send/recieve email like this

![2026-07-07-at-21.00.46.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/zwwmqacadqa3wcaqomw2)

## Reference
- https://github.com/Atomic-Mail/atomic-mail-agentic
