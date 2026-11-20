---
title: "Model Switch Reasoning Checker"
seo_title: "Switch Models Mid-Conversation: Which Thinking Survives? (Free, runs in your browser) | AIEngineerGuide"
h1: "Switching models mid-conversation: which reasoning survives?"
breadcrumb: "Model switch"
app_name: "Model switch reasoning checker"
description: "Pick the Claude or OpenAI models a conversation used and the one you're switching to. See whose thinking blocks or reasoning items the new model reads, which are dropped, and why. Free, runs in your browser."
promise: "Routing from Sonnet 5.5 to Haiku 5.5 and back, or falling back from GPT-6.2 to GPT-6.1? See which earlier reasoning the new model can read, which is dropped, and the caveats."
tool: reasoning-prefix-checker
tab: switch
light_only: true
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Add the models the conversation used so far, oldest first. Or click **Read models from my requests** to take them from the Prefix check tab."
  - "Pick the model you're switching to, and set the platform, `reasoning.context` and account options that apply."
  - "Read one row per earlier model, then the caveats. Copy the share link: it holds only model IDs and options."
faq:
  - q: "Does switching Claude models cause an error?"
    a: "No. A thinking block that the new model or account can't use never causes an error. The API drops it for that request and doesn't bill it, and Claude answers without that reasoning."
  - q: "Can any other model read Claude Fable 5.2's thinking?"
    a: "No. Per Anthropic's November 9, 2026 release notes, no other model reads thinking blocks from Claude Fable 5.2 or Claude Mythos 5.2. Fable 5.2 and Mythos 5.2 do read other models' blocks on the Claude API and on Google-managed Google Cloud."
  - q: "Should I keep a separate history per model?"
    a: "No. Keep sending the whole conversation. Reasoning is lost permanently only if your code removes it; back on a model that can read the blocks, they're read again."
  - q: "What about OpenAI model switches?"
    a: "Persisted reasoning can be reused only within the same model family, and moving to a less capable model in the family drops it too (`model_mismatch`). OpenAI doesn't publish the capability order of astra, sol, terra and luna, so a same-family switch shows both outcomes."
---

## How the switch check works

For Claude, it reads Anthropic's table of which models read which models' thinking on the Claude API, plus the "earlier models" rules. A pair in neither table is shown as unknown. Off the Claude API, only what the docs confirm for that platform is used. Ticking the account box drops blocks from the account-bound models (Fable 5.2, Mythos 5.2, Sonnet 5.5 and Haiku 5.5).

For OpenAI, it uses the model family from the ID (`gpt-6.2-astra` → `gpt-6.2`): a different family drops the reasoning, the same family depends on a capability order OpenAI doesn't publish. Across providers, neither provider's docs describe reading the other's reasoning.

{{< reasoning-sources >}}
