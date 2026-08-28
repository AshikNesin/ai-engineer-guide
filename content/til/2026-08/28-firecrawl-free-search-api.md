---
title: Free Keyless Search API for AI Agents using Firecrawl
url: til/firecrawl-free-search-api
tags:
  - firecrawl
status: published
date: 2026-08-28T00:00:00.000Z
qblog_id: 9ff1afaf-1d74-4a42-8b68-33d353bc7440
---

You can use [Firecrawl](https://firecrawl.dev) search api for free without even api key now.

![image.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-08/ql9nu4natfalxr9occpq)

Just make the api call

```shell
curl -s -X POST "https://api.firecrawl.dev/v2/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "free search api for ai agents",
    "limit": 3
  }'
```

And get the result like this

```json
{
	"success": true,
	"data": {
		"web": [{
			"url": "https://www.reddit.com/r/AI_Agents/comments/1pf9avo/whats_the_best_toolapi_for_web_search_in_an/",
			"title": "What's the best tool/API for web search in an agentic stack? - Reddit",
			"description": "# What’s the best tool/API for web search in an agentic stack?\nGet $5/month in free credits for Parallel's Search, Extract, Monitor, and Task APIs.",
			"position": 1
		}, {
			"url": "https://www.vellum.ai/blog/best-web-search-apis-and-mcps-for-ai-agents",
			"title": "Best Web Search APIs & MCPs for AI Agents 2026 - Vellum",
			"description": "Compare the top 5 web search APIs and MCPs for AI agents: Firecrawl, Brave Search, Exa, Perplexity Sonar, Parallel AI. Free, no API key needed ...",
			"position": 2
		}, {
			"url": "https://www.firecrawl.dev/blog/best-web-search-apis",
			"title": "Best Web Search APIs for AI Applications in 2026 - Firecrawl",
			"description": "Find the best web search API for your AI project. We compare top web search APIs including Firecrawl, Exa, Tavily, SerpAPI, and more - with ...",
			"position": 3
		}]
	},
	"creditsUsed": 2,
	"id": "01a049a5-ba23-71a6-b0b9-0c17baf526a3"
}
```

That's pretty much it.

It's rate limited per IP and the limit is not officially mentioned in their docs (yet?).

For some reason, my home ip address seems to be blocked for some reason. Maybe region specific lock but it worked perfectly in my VMs

![Screenshot-2026-08-29-at-00-21-46.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-08/bc2pp9nurljwdpb7vw6x)


## Reference
- https://www.firecrawl.dev/blog/firecrawl-keyless-launch