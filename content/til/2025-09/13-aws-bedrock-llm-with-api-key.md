---
title: How to use AWS Bedrock LLM with API Keys
url: til/aws-bedrock-llm-with-api-key
tags:
  - aws-bedrock
status: published
date: 2025-09-13T00:00:00.000Z
qblog_id: 1b33d2bc-6908-415d-aa18-8c8e3e1242b3
---

Recently, AWS Bedrock (which is a marketplace for LLM inference) has started supporting API key-based authentication.

Before, you needed to configure IAM credentials and other things, which was kind of a friction if you just wanted to play around with it.

## How to get started?
In your AWS Bedrock dashboard, you can find a new option to generate the key.

https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/api-keys

![2025-09-13-at-23.41.292x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/xq0rahfkitgynwf7ig54)

There you can create a short-lived key or a permanent (or fixed-date) key depending on your use case.

![2025-09-13-at-23.59.192x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/ssaqsepdxvoyc6oorpbx)

Once you have the key, you can use it to interact with the LLM.

For example, here is how you can interact with the Anthropic model using it.

```bash
curl -X POST https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-3-sonnet-20240229-v1:0/converse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AWS_BEDROCK_API_KEY}" \
  -d '{
        "messages": [
          { "role": "user", "content": [{ "text": "Why is sky blue?" }] }
        ]
      }'

```

Happy LLM inference!