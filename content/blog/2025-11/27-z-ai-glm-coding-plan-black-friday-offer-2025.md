---
title: z.ai GLM Coding Plan Black Friday Offer 2025 (80-90% Off)
url: blog/z-ai-glm-coding-plan-black-friday-offer-2025
tags:
  - z-ai
status: published
date: 2025-11-27T00:00:00.000Z
qblog_id: ad613bb2-954a-4871-9269-556ccf997e73
---

z.ai is currently offering black friday offer for their [GLM Coding Plan](https://go.nesin.io/glm). With it you can use latest GLM models like GLM 4.6 which performs as good as Sonnet 4 model. The best part is that you can use it with Claude Code and other various AI coding agents.

## What's the deal?
They usually run **50% off** for the first term (monthly, quarterly, or yearly)

On top of that you get an another **20-30%** off depending on the tier.

And you get another **10% off** as a part of [affiliate deal](https://go.nesin.io/glm)

So overall, you can get **80-90%** off 🤩

That brings Lite yearly plan down to just **$22.68**.

So it's the best time to get the subscription if you plan on getting it.

I highly recommended you to get monthly or yearly plan since the 50% base offer is one time thing. 

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/j9vs3op8nu8mpvtkplyq)

Black friday offer will be valid until Dec 5, 2025

## Is GLM-4.6 is worth your time?
GLM-4.6 is z.ai's latest coding model which is **355B Mixture-of-Experts model (32B active)** with **200K context window**. The best part is it is open source

Overall it performs **almost** as good as proprotery models like Sonnet 4 with almost 90% lower cost as per the benchmarks

![2025-11-28-at-23.25.282x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/nsmj4fvi8ayesot4m6th)

## How to use GLM-4.6 with Claude Code?
If you've already using Claude Code then setup is pretty straightforward

Get the API key from [z.ai platform](https://z.ai/manage-apikey/apikey-list)

Add it in `~/.claude/settings.json`

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/coding/paas/v4",
    "ANTHROPIC_API_KEY": "your-zai-api-key"
  }
}
```

Run `claude`

That's it. Claude Code will now use GLM 4.6 instead of Anthropic now.

You can also map the specific models if you prefer

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/coding/paas/v4",
    "ANTHROPIC_API_KEY": "your-zai-api-key",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air"
  }
}
```

## Limitations
- It's a Chinese AI company (so beware if it is not allowed in the project that you're working on)
- Claude 4.5/Opus 4.5/Gemini 3.0 still leads coding benchmarks

## Should you get it?
My recommended is yes. 

Thought it might not be able to work well for complex problems it is really useful for grunt works like writing test cases and other things.

👉 [GLM Coding Plan](https://go.nesin.io/glm)

Happy AI coding!