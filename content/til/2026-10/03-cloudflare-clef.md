---
title: Clef - Jev like decision model from Cloudflare
url: til/cloudflare-clef
tags:
  - cloudflare
  - decision-models
status: published
date: 2026-10-03T00:00:00.000Z
qblog_id: beb94d81-6288-4e54-8e4c-498f7713fec1
---

Cloudflare has released Clef - a decision making model similar to Jev. And it performs as good as Jev in their benchmarks.

Unlike Jev, this model **supports image/vision** as well.

And its available in their [Cloudflare Worker AI](https://developers.cloudflare.com/workers-ai/models/clef/)

And its Apache 2.0 licenses and weights are available in [HuggingFace](https://huggingface.co/Cloudflare/clef)

It supports Typesafe AI Jev like api

```shell
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/cloudflare/clef \\
  -X POST \\
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \\
  -d '{
    "model": "clef",
    "state": "Checkout has been failing for every customer for the last hour.",
    "questions": {
      "urgent": { "type": "noul", "instructions": "Is this support request urgent?" },
      "team": {
        "type": "choice",
        "instructions": "Which team should handle this request?",
        "criteria": {
          "billing": "Payments, invoices, and refunds",
          "technical": "Outages, errors, and configuration",
          "sales": "Plans and upgrades"
        }
      },
      "severity": {
        "type": "score",
        "instructions": "How severe is the customer impact?",
        "criteria": ["No impact", "Minor", "Major", "Critical"]
      }
    }
  }'
```

## Reference
https://blog.cloudflare.com/clef-decision-models/