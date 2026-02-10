---
title: How to handle model fallback in Mastra.ai
url: blog/model-fallback-in-mastra-ai
tags:
  - mastra-ai
status: published
date: 2025-10-02T00:00:00.000Z
qblog_id: 30f1b2e9-f658-4d05-8b80-3d38335a7a9b
---

[Mastra.ai](https://mastra.ai) is a TypeScript based agent framework which has lot of features that you need to build an AI app with with out making you learn so many framework specific thing like in case of Langchain.

Recently, they've released model fallback feature which is really useful for production scale application.

## What is model fallback?
As the name suggests, if a particular model fails, then it fallbacks to the next model.

There are high changes that your application going down if you depend only one LLM model.

## How to define model fallback?

Just mention that models in an array. You can also specify `maxRetries` as well.

Here is an example of it.

```ts
import { Agent } from '@mastra/core';
import { openai, anthropic } from '@mastra/llm';

const agent = new Agent({
  name: 'weather-assistant',
  instructions: 'You are a weather assistant.',
  model: [
    {
      model: openai('gpt-5-mini'),
      maxRetries: 5,
    },
    {
      model: anthropic('claude-4-5-sonnet'),
      maxRetries: 1,
    },
  ],
});

```

## Reference
- [Model fallbacks: Your safety net for production AI](https://mastra.ai/blog/model-fallback)

Happy having fallback!
