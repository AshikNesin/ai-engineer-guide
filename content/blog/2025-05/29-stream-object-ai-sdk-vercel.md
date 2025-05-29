---
title: How to Stream Object in AI SDK by Vercel
date: 2025-05-29
description: 
tags:
  - vercel
  - OpenAI
  - library
url: blog/vercel-ai-sdk-streamobject
via_url:
---
[AI SDK](https://ai-sdk.dev/) by Vercel is library helps us to build AI powered application pretty easily. It abstracts lots of things for us so that we can focus on what truly matters without having to reinvent the wheel.


## Dependency

```shell
npm install ai
# In this example, we'll use OpenAI so we need to install model provider as well
npm install @ai-sdk/openai
# Zod
npm install zod
```


## Usage - Simple Example

Here is a simple example of  AI SDK using OpenAI. If you notice, changing a model is just one line rather than updating lot of code. That's the main advantage that AI SDK brings in.

```js
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  // Ensure OPENAI_API_KEY environment variable is set
  model: openai("gpt-4o-mini"),
  system: "You are a friendly assistant!",
  prompt: "Why is the sky blue?",
});

console.log(text);
```

![2025-05-29 at 23.49.04@2x.png](/images/2025-05-29-at-23.49.04-at-2x.png)
## Usage - StreamObject

Sometime you might want to stream a **typed structured object**  when using a language model.

Now let's see a case in which you might want to stream an object

```js
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const mathResponseSchema = z.object({
  steps: z.array(
    z.object({
      explanation: z.string(),
      output: z.string(),
    })
  ),
  finalAnswer: z.string(),
});

const { partialObjectStream } = streamObject({
  model: openai("gpt-4o-mini"),
  schema: mathResponseSchema,
  system: "You are a helpful math tutor.",
  prompt: "solve 8x + 31 = 2",
});

for await (const partialObject of partialObjectStream) {
  console.clear();
  console.log(partialObject);
}

```
## References
- https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-object#streamobject

Happy streaming object!