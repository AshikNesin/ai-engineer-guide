---
title: How to use OpenAI models on AWS Bedrock
url: til/openai-models-on-aws-bedrock
tags:
  - openai
  - aws-bedrock
status: published
date: 2026-06-02T00:00:00.000Z
qblog_id: 03b4a452-16b3-42dc-8f41-4a84a672268d
---

OpenAI models like GPT-5.4 and GPT-5.5 are available on AWS Bedrock platform

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">OpenAI frontier models and Codex are now generally available on AWS, giving enterprises a new way to build on Amazon Bedrock with OpenAI through the security, compliance, and governance workflows they already use.<br><br>This is also the beginning of a broader expansion of OpenAI…</p>&mdash; OpenAI (@OpenAI) <a href="https://x.com/OpenAI/status/2061564502160892138?ref_src=twsrc%5Etfw">June 1, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

## How to use it?

```shell
curl --location 'https://bedrock-mantle.us-east-2.api.aws/openai/v1/responses' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $BEDROCK_API_KEY' \
--data '{
    "model": "openai.gpt-5.4",
    "input": "Write a one-sentence bedtime story about a unicorn."
  }'
```

Replace `BEDROCK_API_KEY` with your AWS Bedrock long-term API key.

![2026-06-02-at-23.49.37.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-06/r2imr9bpqsv7bfc87k2u)


And update `us-east-2` with your region but make sure that it is available on that region.

You can read more about it in their docs here:
https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-openai.html