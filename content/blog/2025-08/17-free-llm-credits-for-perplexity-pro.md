---
title: Perplexity Pro Users Get $5 Free LLM API Credits Every Month
url: blog/free-llm-credits-for-perplexity-pro
status: published
date: 2025-08-17T00:00:00.000Z
qblog_id: b9c2dda2-93f9-47ca-b037-58904c972ebc
---

Recently I came to know that you get $5 credit every month for Perplexity AI models if you're on Perplexity Pro plan.

## How to get started?
Head over to your [Perplexity setting page](https://www.perplexity.ai/account/api/group) and add your billing details if not done already.
![2025-08-17-at-23.03.172x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/vwps4snc99dry3uajeaz)

And then you'll be asked to give your credit card. You can give it. They don't charge you if you spend less than $5/mo

Once you're done, head over to [API key](https://www.perplexity.ai/account/api/keys) and get your API key.

We'll be using this key to make LLM calls going forward.

## Making LLM Call.
It is as simple as making OpenAI api calls. In fact, their API follows chat completion and you can drop in replace it with your OpenAI API just by changing the base API URL.

Here is an example

```js
curl https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar",
    "messages": [
      {
        "role": "user", 
        "content": "What's the current repo rate in India?"
      }
    ]
  }'
```
You'll be getting a response like this

<details>
  <summary>API Response</summary>

  ```json
{
    "id": "effa842e-3338-4ae4-0000-d1c2dcc7408f",
    "model": "sonar",
    "created": 1755452599,
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 163,
        "total_tokens": 172,
        "search_context_size": "low",
        "cost": {
            "input_tokens_cost": 0.0,
            "output_tokens_cost": 0.0,
            "request_cost": 0.005,
            "total_cost": 0.005
        }
    },
    "citations": [
        "https://tradingeconomics.com/india/interest-rate",
        "https://www.ujjivansfb.in/banking-blogs/borrow/what-is-repo-rate",
        "https://www.finnovate.in/learn/blog/rbi-repo-rate-update-august-2025",
        "https://www.southindianbank.com/blog/general-topics/rbi-cuts-repo-rate-by-50-basis-points-changes-policy-stance-to-neutral",
        "https://cleartax.in/s/repo-rate"
    ],
    "search_results": [
        {
            "title": "India Interest Rate",
            "url": "https://tradingeconomics.com/india/interest-rate",
            "date": "2025-08-06",
            "last_updated": "2025-08-16"
        },
        {
            "title": "What is Repo Rate and How Does it Work?",
            "url": "https://www.ujjivansfb.in/banking-blogs/borrow/what-is-repo-rate",
            "date": "2025-08-17",
            "last_updated": "2025-08-17"
        },
        {
            "title": "RBI Holds Repo Rate at 5.5% in August 2025",
            "url": "https://www.finnovate.in/learn/blog/rbi-repo-rate-update-august-2025",
            "date": "2025-08-06",
            "last_updated": "2025-08-06"
        },
        {
            "title": "RBI cuts repo rate for third consecutive time in a row",
            "url": "https://www.southindianbank.com/blog/general-topics/rbi-cuts-repo-rate-by-50-basis-points-changes-policy-stance-to-neutral",
            "date": "2025-06-09",
            "last_updated": "2025-06-14"
        },
        {
            "title": "Current Repo and Reverse Repo Rate 2025",
            "url": "https://cleartax.in/s/repo-rate",
            "date": "2025-08-06",
            "last_updated": "2025-08-06"
        }
    ],
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "finish_reason": "stop",
            "message": {
                "role": "assistant",
                "content": "The current repo rate in India is **5.50%** as of August 6, 2025. The Reserve Bank of India (RBI) maintained this rate during its August Monetary Policy Committee meeting, holding it steady after three consecutive cuts earlier in the year[1][3][4][5].\n\nAdditional details:\n- The RBI has adopted a neutral policy stance since June 2025, balancing inflation and growth concerns.\n- Inflation projections have eased to around 3.1% for FY 2025-26, within the target range of 2–6%[1][5].\n- GDP growth forecast is maintained at about 6.5% for the current fiscal year[1][5].\n- The reverse repo rate is currently unchanged at 3.35%[5]."
            },
            "delta": {
                "role": "assistant",
                "content": ""
            }
        }
    ]
}
```

</details>

If you notice, the response you get is **real time** response not some pretrained knowlerge. That is the core offering of Sonar models.

## Sonar Models
Perplexity has wide range of LLM models available that you might find it useful depending on the use case.

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/hifsx9g32coytxzuqdqg)

- In general, ig you want to do search then `sonar` and `sonar-pro` models are good choice.
- `sonar-reasoning` and `sonar-reasoning-pro` are useful for multi-step tasks
- `sonar-deep-research` is useful for doing depth research

## References
- [API Groups & Billing - Perplexity](https://docs.perplexity.ai/getting-started/api-groups)
- [Overview - Perplexity](https://docs.perplexity.ai/getting-started/overview)

Happy building AI!