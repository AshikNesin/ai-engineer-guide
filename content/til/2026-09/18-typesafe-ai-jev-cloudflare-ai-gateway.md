---
title: Typesafe.ai's Jev on Cloudflare AI Gateway
url: til/typesafe-ai-jev-cloudflare-ai-gateway
tags:
  - jev
  - cloudflare-ai-gateway
status: published
date: 2026-09-18T00:00:00.000Z
qblog_id: 3c92cdea-5217-46b1-be1c-2ea543f1ddf0
---

[Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) by TypeSafe is a model that is focused on solving **structured evaluation** really well and cost effectively.

For example, instead of using regular LLMs for classifing support tickets, you can consider using it to get the fast + better output with cheaper price.

Input tokens: $0.042 / MTok and Output tokens are free. 

It is been going crazy on X and people of building lot of cool things with it.

And now it is available in Cloudflare AI Gateway as well

## Example
```shell
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
  "model": "typesafe/jev",
  "input": {
    "state": "Help! My payouts have been failing for 3 days.",
    "questions": {
      "is_urgent": {
        "type": "noul",
        "instructions": "Does this convey urgency?",
        "criteria": {
          "true": "Explicitly time-sensitive",
          "false": "No urgency expressed"
        }
      },
      "department": {
        "type": "choice",
        "instructions": "Which team should handle this?",
        "criteria": {
          "billing": "Payments, invoicing, refunds",
          "technical": "Bugs, outages, integrations",
          "sales": "Pricing, upgrades, new accounts"
        }
      },
      "frustration": {
        "type": "score",
        "instructions": "How frustrated is the customer?",
        "criteria": [
          "Calm",
          "Frustrated",
          "Very angry"
        ]
      }
    }
  }
}'
```

Replace `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` with your api key and account id.

And for that we'll be getting an output like this

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": {
      "type": "noul",
      "noul": 0.95
    },
    "department": {
      "type": "choice",
      "choice": "billing",
      "confidence": 0.8,
      "probabilities": {
        "billing": 0.87,
        "sales": 0,
        "technical": 0.13
      }
    },
    "frustration": {
      "type": "score",
      "score": 1.04,
      "confidence": 0.94,
      "legend": {
        "0": "Calm",
        "1": "Frustrated",
        "2": "Very angry"
      },
      "probabilities": {
        "0": 0,
        "1": 0.96,
        "2": 0.04
      }
    }
  },
  "usage": {
    "input_tokens": 426,
    "output_tokens": 73
  }
}
```

## Reference
- https://developers.cloudflare.com/ai/models/typesafe/jev/