---
title: Gemini CLI - Open Source AI Agent from Google
date: 2025-06-25
description: 
tags:
  - bookmark
  - gemini-cli
url: blog/google-gemini-cli
---
Another day, Another Agent CLI 😜

This time it is from Google and it is completely open source similar to [OpenAI Codex](https://github.com/openai/codex)

At this point, pretty much all the vendors are competing with AI assisted coding agent 🤖

Here are some of the highlights from the gemini-cli:
- Available for free (with personal Google account)
- Generous rate limiting (60 model requests per minute and 1,000 requests per day at no charge)
- Bring your own key support as well
- Search engine access, obviously
- MCP support
- Customizable prompts

And it is licensed under [Apache 2.0](https://github.com/google-gemini/gemini-cli/blob/main/LICENSE)

![Pasted image 20250625233321.png](https://images.nesin.io/qblog/AIEngineerGuide/images/2025-06/Pasted-image-20250625233321.png)

## How to get started?

Just install the CLI
```sh
npm install -g @google/gemini-cli
```

And login with your personal Google account. 

Then enter your prompt and let it do it's magic 🪄

![2025-06-25 at 23.42.11@2x.png](https://images.nesin.io/qblog/AIEngineerGuide/images/2025-06/2025-06-25-at-23.42.11-at-2x.png)

Sam Witteveen has a really detailed video about it which you might find useful

<iframe width="560" height="315" src="https://www.youtube.com/embed/KUCZe1xBKFM?si=-UVhGtjgWT23xYNy&amp;start=40" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


On a side note, this release reminds me of recent Tweet from Marc 👇 

![Pasted image 20250625231812.png](https://images.nesin.io/qblog/AIEngineerGuide/images/2025-06/Pasted-image-20250625231812.png)

With it's free usage, Google might potentially try to gain more marketshare.

One thing you should be mindful is that, if you're using free option (login with Google Account), then your data will be used for model training. 
## Resources
- https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/
- https://github.com/google-gemini/gemini-cli?tab=readme-ov-file

Happy building apps!