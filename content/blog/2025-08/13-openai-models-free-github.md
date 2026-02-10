---
title: How to use OpenAI Models for Free with GitHub Models
url: blog/openai-models-free-github
tags:
  - github-models
  - openai
status: published
date: 2025-08-13T00:00:00.000Z
description: null
qblog_id: f12f1610-e596-422c-b9d2-72428a67cbf4
via_url: null
---

GitHub provides free access to OpenAI and other AI models for you to play around with them.

Although it is heavily [rate limited](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models#rate-limits) it's a good start if you want to play around in LLM models without having to spend some money.

![2025-08-13 at 23.47.21@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-13-at-23.47.21-at-2x.png)

## How to get started?

Head over to [GitHub Models](https://github.com/marketplace?type=models)  and select the model that you want to use.

You can use their playground feature to test the models before even we start using this from API.

In order to access the model you need to create a **PAT** token.

![2025-08-13 at 23.29.36@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-08/2025-08-13-at-23.29.36-at-2x.png)
And then you can make API calls like this. 

```bash
curl -X POST "https://models.github.ai/inference/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -d '{
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "What is the capital of France?"
            }
        ],
        "temperature": 1.0,
        "top_p": 1.0,
        "model": "openai/gpt-4.1"
    }'

```

Just replace `$GITHUB_TOKEN` with your PAT.

## References
- [About GitHub Models - GitHub Docs](https://docs.github.com/en/github-models/about-github-models)

Happy inferencing AI!
