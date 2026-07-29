---
title: Free Kimi K3 API via Modal
url: til/free-kimi-k3-api-modal
tags:
  - kimi-k3
  - modal
status: published
date: 2026-07-29T00:00:00.000Z
qblog_id: 51a5352e-4da7-428b-9d50-0dfff9ff52d9
---

[Kimi K3](/til/kimi-k3-open-weights/) model is now available on [Modal.com](https://modal.com/) and they provide **$30/mo** credits every month on their free plan. You might need to add credit card though.

> It's covered by Modal's standard offer: $30 of free compute every single month, so you can keep using K3 on the Shared API for free, month over month.

So essentially, you get $30 worth of usage of Kimi K3 model on their [shared token based usage](https://modal.com/blog/kimi-k3-by-moonshot-now-available-on-modal)

## How to get started?

Create a new **managed** endpoint and choose Kimi K3 in modal dashboard
![2026-07-29-at-23.50.242x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/iq0hql1cbcnqnoycm7dw)

You'll get a dedicated endpoint like this: `https://example--ep-kimi-k3-server.us-west.modal.direct`

![2026-07-29-at-23.52.302x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/bqpoeifn5bls14rlay1x)

You can click on the **quick start** to get code snippets. Make sure to get `MODAL_PROXY_TOKEN_SECRET` as well which is needed to make the request

![2026-07-29-at-23.53.292x.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-07/sd4gkp9fddns3rglcuqe)

```shell
curl "https://example--ep-kimi-k3-server.us-west.modal.direct/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Modal-Key: $MODAL_PROXY_TOKEN_ID" \
  -H "Modal-Secret: $MODAL_PROXY_TOKEN_SECRET" \
  -d '{
    "model": "moonshotai/Kimi-K3",
    "messages": [
      {
        "role": "system",
        "content": "You are a concise technical assistant."
      },
      {
        "role": "user",
        "content": "Explain why low latency matters for LLM endpoints in three bullets."
      }
    ],
    "temperature": 0.3,
    "max_tokens": 2048,
    "top_p": 0.95,
    "stream": false,
    "reasoning_effort": "none"
  }'
  ```

It's a OpenAI chat completion format API endpoint.


