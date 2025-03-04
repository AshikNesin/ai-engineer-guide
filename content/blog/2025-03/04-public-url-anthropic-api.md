---
title: Directly Using Public URLs for Images and PDFs in Anthropic API
date: 2025-03-04
description: 
tags: 
url: blog/public-url-anthropic-api
via_url: https://x.com/alexalbert__/status/1895504248206709246
---
When we interact with any LLM models like Anthropic Claude or OpenAI models, we're expected to pass in all the context that is needed to process the request.

And the LLM model, just process that request and it'll respond with the result.

If we need to use pdf document or an image, then we need to **encode that file as base64** and pass it in the API request.

It does the job well, but not so great in term of developer experience especially if the image/pdf is a public one. 

In that case, you had to download the file, convert it to base64 then pass it to API request.

```js
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// Step 1: Fetch the image data - Using Wikipedia's Mona Lisa image
const imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg";
const imageBuffer = await fetch(imageUrl).then((r) => r.arrayBuffer());

// Step 2: Convert to base64 (increases payload size)
const base64Image = Buffer.from(imageBuffer).toString("base64");

// Step 3: Send the entire encoded image to API
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

Anthropic API now allows you to **directly reference public URLs** for images and PDFs, making your code cleaner and requests smaller (no more - base64 encoding) 🤩

```js
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// Simply reference the public URL directly
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
            type: "url", // New URL type!
            url: imageUrl, // Direct reference
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

> 💡 **Key Benefit**: This approach eliminates the need to download and encode the image yourself, reducing code complexity and payload size.

The same URL-based approach works great for PDFs too:

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

_Note: Make sure `ANTHROPIC_API_KEY` is set in your environmental variables for authentication._
### Limitations
- Only works with **publicly accessible URLs** that Anthropic API can access
- The file must be available at request time (temporary URLs must not expire too quickly)

### References
- [Anthropic API Docs: Messages API](https://docs.anthropic.com/en/api/messages-examples)
- [Anthropic API Docs: PDF Support](https://docs.anthropic.com/en/docs/build-with-claude/pdf-support)
- [Alex Albert's Tweet](https://x.com/alexalbert__/status/1895504248206709246)

Happy Building AI-Apps! 