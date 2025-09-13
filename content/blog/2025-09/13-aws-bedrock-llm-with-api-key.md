---
title: How to use AWS Bedrock LLM with API Keys
url: blog/aws-bedrock-llm-with-api-key
tags:
  - aws-bedrock
status: published
date: 2025-09-13T00:00:00.000Z
qblog_id: 85f63b37-7f51-4a90-baa8-52eeff94baa9
---

Recently, AWS Bedrock (which is a marketplace for LLM Inference) starts supporting API Key based authentication.

Before you need to configure IAM creditentials and other other things which is kind of friction if you just want to play around with it.

## How to get started?
In your AWS bedrock dashboard you can find a new option to generate the key.

https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/api-keys

There you can create a short lived key or a permanent (of fixed date key) depending on your use case.

Once you have the key, you can just use the key to interact with the LLM.

For example, here is how you can interact with Anthropic model using it.

```curl
curl -X POST "https://bedrock-runtime.us-east1.amazonaws.com/model/us.anthropic.claude-3-7-sonnet-20250219-v1:0/converse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AWS_BEDROCK_API_KEY}" \
  -d '{
        "messages": [
          { "role": "user", "content": [{ "text": "Hello from Bedrock API key!" }] }
        ]
      }'

```

Happy LLM inference!