---
title: Decision models in llama.cpp
url: til/decision-models-in-llama-cpp
tags:
  - llama-cpp
  - decision-models
status: published
date: 2026-10-02T00:00:00.000Z
qblog_id: d1ea33ab-4703-441d-99f9-4fd701e228ee
---

Llama.cpp has support for the decision models which you can use in the dedicated endpoint `/v1/systemone`

It follows Typesafe.ai API format

```shell
curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Customer message: I was charged twice for my order last week and nobody has replied.",
    "questions": {
      "route": {
        "type": "choice",
        "instructions": "Which team should handle this?",
        "criteria": {
          "billing": "payments, charges, refunds, invoices",
          "shipping": "delivery, tracking, lost or late parcels",
          "technical": "bugs, errors, login problems"
        }
      },
      "angry": {
        "type": "noul",
        "instructions": "Is the customer angry?"
      },
      "urgency": {
        "type": "score",
        "instructions": "How urgent is this?",
        "criteria": ["can wait", "this week", "today", "right now"]
      }
    }
  }'
```

## Reference
- https://huggingface.co/blog/ggml-org/decision-models-in-llamacpp