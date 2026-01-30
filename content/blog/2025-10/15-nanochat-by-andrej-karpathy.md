---
title: nanochat by Andrej Karpathy
url: blog/nanochat-by-andrej-karpathy
tags:
  - andrej-karpathy
  - build-llm
status: published
date: 2025-10-15T00:00:00.000Z
qblog_id: eb8c5ff7-96d0-4ffb-ac7b-bc8010f651f0
---

Andrej Karpathy has recently released [nanochat](https://github.com/karpathy/nanochat) where he builds a ChatGPT like LLM from scratch purely for the purpose of learning.

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/ihxwe6cqbxaw380hcksb)

This project is roughly 8000 lines of code [hand-written](https://x.com/karpathy/status/1977758204139331904) by him.

And it covers:
- Building a tokenizer (rust)
- Pretraining a Transformer LLM on [FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)
- Midtrain on user-assistant conversations from SmolTalk, tool use, etc
- Efficient inference the model in an Engine with KV cache
- Simple prefill/decode
- Tool use (Python interpreter in a lightweight sandbox)
- Talk to it over CLI or ChatGPT-like WebUI.

And much more.

And the best part is, for **~$100** in cost (~4 hours on an 8XH100 node) you should be able to replicate it 🤯

👉 [https://github.com/karpathy/nanochat/discussions/1](https://github.com/karpathy/nanochat/discussions/1)

## Reference
[https://x.com/karpathy/status/1977755427569111362](https://x.com/karpathy/status/1977755427569111362)

Happy building LLM!