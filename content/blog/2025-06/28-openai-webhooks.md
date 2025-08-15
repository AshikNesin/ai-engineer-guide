---
title: Using OpenAI Webhooks to Handle Long-Running Tasks Efficiently
date: 2025-06-28
description: 
tags:
  - OpenAI
  - TIL
url: blog/openai-webhooks
via_url: https://x.com/openaidevs/status/1938286704856863162
---
Along with [Deep Research API](https://aiengineerguide.com/blog/openai-deep-research-api/) OpenAI has released support for [webhooks](https://platform.openai.com/docs/guides/webhooks) for their API endpoint.

So for the use case that does not require you wait until the response is completed or the ones that takes so much time to complete like Deep Research API. 

Using Webhooks API makes sense instead of alternatives like polling.

As per their docs, you'll be able to leverage webhooks for events like these:
- Background response is generated
- Batch completes
- Fine-tuning job finishes

And the webhooks follows [standard-webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md) specification.

## Configuring Webhook Endpoints

You can configure the webhooks in the [dashboard](https://platform.openai.com/settings/project/webhooks)

Webhooks are configured **per-project**. So you need to select the project then configure the webhook endpoint


![2025-06-28 at 23.35.48@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-06/2025-06-28-at-23.35.48-at-2x.png)

> After creating a new webhook, you'll **receive a signing secret** to use for server-side verification of incoming webhook requests. Save this value for later, since you won't be able to view it again.

**What is signing secret?**

Since it is a webhook, anyone can make call to your endpoint and try to manipulate the data if they know your webhook API endpoint.

Signing secret is a way using which you can validate whether the request came from a legit source (in our case, OpenAI)
### Supported Events Types
These are the events types that are available for you to subscribe to

| Category             | Event Type                     |
|----------------------|--------------------------------|
| **Batches**          | batch.completed                |
|                      | batch.failed                   |
|                      | batch.expired                  |
|                      | batch.cancelled                |
| **Background Responses** | response.completed         |
|                      | response.failed                |
|                      | response.cancelled             |
|                      | response.incomplete            |
| **Fine-Tuning Jobs** | fine_tuning.job.succeeded      |
|                      | fine_tuning.job.failed         |
|                      | fine_tuning.job.cancelled      |
| **Eval Runs**        | eval.run.succeeded             |
|                      | eval.run.failed                |
|                      | eval.run.canceled              |

### Webhook Payload
Once the webhook is configured, you'll start getting  events like this

```
POST https://yourserver.com/webhook
user-agent: OpenAI/1.0 (+https://platform.openai.com/docs/webhooks)
content-type: application/json
webhook-id: wh_685342e6c53c8190a1be43f081506c52
webhook-timestamp: 1750287078
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=
```

```json
{
  "object": "event",
  "id": "evt_685343a1381c819085d44c354e1b330e",
  "type": "response.completed",
  "created_at": 1750287018,
  "data": { "id": "resp_abc123" }
}
```

As soon as you get the webhook request, you need to respond with 2xx status code within few seconds. 

If it didn't receive 2xx request, it'll attempt to retry gain (upto 72 hours with exponential backoff)

3xx requests will not be honored (redirection requests) and it'll assume it's a failure.

In ideal case, OpenAI webhook will not deliver duplicate requests however they'll send `webhook-id` header which can be used as idempotency key to deduplicate.

## Verifying webhook signatures

You can use the OpenAI SDK like this:

```js

const client = new OpenAI();
const webhook_secret = process.env.OPENAI_WEBHOOK_SECRET;

// will throw if the signature is invalid
const event = client.webhooks.unwrap(req.body, req.headers, { secret: webhook_secret });

```

```python

client = OpenAI()
webhook_secret = os.environ["OPENAI_WEBHOOK_SECRET"]

# will raise if the signature is invalid
event = client.webhooks.unwrap(request.data, request.headers, secret=webhook_secret)

```

Or you can use [standard-webhooks](https://github.com/standard-webhooks/standard-webhooks/tree/main?tab=readme-ov-file#reference-implementations) libraries to do the verification part.

## References
- https://platform.openai.com/docs/guides/webhooks

Happy building apps!
