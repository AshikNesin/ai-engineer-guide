---
title: Models.dev - Open Source AI Models Pricing Database
url: blog/models-dev-open-source-ai-models-database
tags:
  - til
  - bookmark
status: published
date: 2025-07-05T00:00:00.000Z
description: null
qblog_id: 432fffcd-6a59-467f-a6ed-196d36b2e715
via_url: null
---

We've so many AI models these days and **keep track of pricing and the capabilities** is not a easy task anymore.

And some of the providers might hide the older model pricing from the pricing page as well.

Today, I've came across [Models.dev](https://models.dev/)  - an open source database of AI models

![2025-07-05 at 20.47.35@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-07/2025-07-05-at-20.47.35-at-2x.png)
Here are the things that are there in the dataset
- Provider
- Model Name
- Provider Id
- Model Id
- Capabilities
	- Tool Call Support
	- Reasoning
	- Input - Text, Image, Video, Audio, Pdf
	- Output - Text
- Cost (per 1 million tokens)
	- Input
	- Output
	- Cache Read (if supported)
	- Cache Write (if supported)
	- Context Limit
	- Output Limit
- Temperature
- Weights
- Knowledge cut off (Month + Year)
- Release Date
- Last Updated

## API Support

You can access all this information via API as well 🤯

```shell
curl https://models.dev/api.json
```

## Dataset

| **Description** | **Link**                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Source Code     | [https://github.com/sst/models.dev](https://github.com/sst/models.dev)                                       |
| Dataset         | [https://github.com/sst/models.dev/tree/dev/providers](https://github.com/sst/models.dev/tree/dev/providers) |

Happy measuring cost!
