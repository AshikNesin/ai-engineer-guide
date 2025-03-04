---
title: OpenAI SDK support for Anthropic API
date: 2025-03-04
description: 
tags: 
url: blog/anthropic-api-openai-sdk-compatibility
---

Migrating from one AI model-as-service provider to another is such a pain. They might have their own way of doing things which might not be supported by another provider.

Tools like [AI SDK by Vercel](https://sdk.vercel.ai/docs/introduction) or [LangChain](https://js.langchain.com/docs/introduction/) are created to address these pain points. 

But however, if you're using official SDK by the provider then you are out of luck.

Thankfully, OpenAI API is kind of becoming norm in the industry. And switching a provider is as easy as updating the base url in the SDK.

Recently, Anthropic API has announced [OpenAI SDK compatibility](https://docs.anthropic.com/en/api/openai-sdk) (beta) using which you **quickly evaluate** Anthropic model capabilities with minimal effort.

**What's the catch?**
It is not intended to be used for production application and does not support things like ([PDF processing](https://docs.anthropic.com/en/docs/build-with-claude/pdf-support), [citations](https://docs.anthropic.com/en/docs/build-with-claude/citations), [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking), and [prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching), etc)

And lots of model parameters are [not supported](https://docs.anthropic.com/en/api/openai-sdk#detailed-openai-compatible-api-support) as well

## How to get started?
Just update the `baseURL` and `apiKey` in the OpenAI SDK. Then you're good to go

```js
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "ANTHROPIC_API_KEY",   // Your Anthropic API key
    baseURL: "https://api.anthropic.com/v1/",  // Anthropic API endpoint
});

const response = await openai.chat.completions.create({
    messages: [
        { role: "user", content: "Who are you?" }
    ],
    model: "claude-3-7-sonnet-20250219", // Claude model name
});

console.log(response.choices[0].message.content);

```

That's pretty much it.
### Reference
- [Anthropic API Docs](https://docs.anthropic.com/en/api/openai-sdk#detailed-openai-compatible-api-support)

Happy migrating models!