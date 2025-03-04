---
title: Directly Using Public URLs for Images and PDFs in Anthropic API
date: 2025-03-04
description: 
tags: 
url: blog/public-url-anthropic-api
via_url: https://x.com/alexalbert__/status/1895504248206709246
---
When we interact with any LLM models like Anthropic Claude or OpenAI GPT, we're expected to pass in all the context that is needed to process the request.

For example, if you need to use image or pdf then you had to **send the entire file as `base64`** when making the API request.

And the LLM model, just process that request and give back the result back to you.

```js
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// Using Wikipedia's Mona Lisa image
const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg";
const imageBuffer = await fetch(imageUrl).then((r) => r.arrayBuffer());
const base64Image = Buffer.from(imageBuffer).toString("base64");

const response = await anthropic.messages.create({
  model: "claude-3-sonnet-20240229",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: base64Image,
          },
        },
        {
          type: "text",
          text: "What do you see in this famous painting?",
        },
      ],
    },
  ],
});

console.log(response.content[0].text);
```


Recently, Anthropic API starts public **URL-referenced**  image and pdf as well 🤩

And we don't need to convert it to base64 anymore for public URL.

We can just directly pass the url instead.

```js
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// Using Wikipedia's Mona Lisa image
const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg";

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "url",
            url: imageUrl,
          },
        },
        {
          type: "text",
          text: "What do you see in this famous painting?",
        },
      ],
    },
  ],
});

console.log(response.content[0].text);
```

![2025-03-04 at 09.15.34@2x.png](/images/2025-03-04-at-09.15.34-at-2x.png)

And similarly, for pdf as well, we have to pass in the public URL.

```js
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "url",
            url: "https://arxiv.org/pdf/1706.03762",
          },
        },
        {
          type: "text",
          text: "What are the key findings in this document in TLDR format?",
        },
      ],
    },
  ],
});

console.log(response.content[0].text);
```

![2025-03-04 at 09.20.09@2x.png](/images/2025-03-04-at-09.20.09-at-2x.png)
Note: Make sure `ANTHROPIC_API_KEY` set in your environmental variable for auth.

### References
- [Anthropic API Docs: Messages API](https://docs.anthropic.com/en/api/messages-examples)
- [Anthropic API Docs: PDF Support](https://docs.anthropic.com/en/docs/build-with-claude/pdf-support)
- [Alex Albert's Tweet](https://x.com/alexalbert__/status/1895504248206709246)

Happy Building AI-Apps! 