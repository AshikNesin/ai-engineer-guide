---
title: OpenAI Deep Research API
date: 2025-06-27
description: 
tags:
  - OpenAI
  - TIL
url: blog/openai-deep-research-api
via_url: https://x.com/openaidevs/status/1938286704856863162
---
OpenAI has recently released [deep research](https://platform.openai.com/docs/guides/deep-research) models as API.

Generally, deep research are most advanced models that is designed to solve more complex problem. It has access to the internet, synthesize the data across websites, you can even bring in your own logic by using MCP servers, run code (using Code Interpreter), etc.

Those models power the **deep research in ChatGPT**

One thing to keep in mind though is they to too much time though. 

Until recently, the models were only available in ChatGPT but now they're making it available via API as well.

![2025-06-27 at 23.49.10@2x.png](/images/2025-06-27-at-23.49.10-at-2x.png)

This API might be a good fit for the cases where you want **best** quality output and okay with taking more time.

Here are some official docs for you to get started:
- https://cookbook.openai.com/examples/deep_research_api/introduction_to_deep_research_api
- https://cookbook.openai.com/examples/deep_research_api/introduction_to_deep_research_api_agents

And here are some are highlights mentioned in the tweet replies/blog post
- Does NOT support chat completion API. Only supports Responses API
- Beware of the costs associated when using this API 

## References
- https://platform.openai.com/docs/guides/deep-research

Happy building apps!