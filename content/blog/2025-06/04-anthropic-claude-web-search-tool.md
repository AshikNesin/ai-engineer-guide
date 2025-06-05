---
title: Anthropic Claude Web Search Tool via API
date: 2025-06-04
description: 
tags:
  - anthropic
url: blog/anthropic-claude-web-search-tool
via_url:
---
Anthropic has recently added support for [web search tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tooll). This tools gets executed at their server during LLM inference.  

## What does web search tool does?
As the name suggest, it can search the internet real-time and use the content for generating response. By doing so it overcomes the core limitation of LLMs -- getting up to date information beyond knowledge cutoff date. And it indirectly increases the accuracy rate.

## Quick Example

When making the API request, we need to define the following tool in the tools array

### Tool definition

```json
{ 
	"type": "web_search_20250305",
	"name": "web_search",
	// Optional: Limit the number of searches per request
	"max_uses": 5, 
	// Optional: Only include results from these domains
	"allowed_domains": ["example.com", "trusteddomain.org"], 
	// Optional: Never include results from these domains
	"blocked_domains": ["untrustedsource.com"], 
	// Optional: Localize search results 
	"user_location": { "type": "approximate", "city": "Chennai", "region": "Tamil Nadu", "country": "IN", "timezone": "Asia/Kolkata" }
}
```

| **Feature**          | **Details**                                                                                                                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Max Uses**         | Limits the number of searches using the `max_uses` parameter. <br><br> If the limit is exceeded, `web_search_tool_result` returns an error with code `max_uses_exceeded`.                                                                                                                                      |
| **Domain Filtering** | - Use domains without `http://` or `https://` (e.g., `example.com`) <br> - Automatically includes subdomains (e.g., `example.com` covers `docs.example.com`) <br> - Supports subpaths (e.g., `example.com/blog`) <br> - Use either `allowed_domains` *or* `blocked_domains`, not both.                         |
| **Localization**     | Use the `user_location` parameter to localize search results. <br><br>**Supported Fields:**<br>• `type`: Must be `approximate`<br>• `city`: City name<br>• `region`: State or region<br>• `country`: Country<br>• `timezone`: [IANA timezone ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) |


### Request
Here is a simple example:

```sh
curl --location 'https://api.anthropic.com/v1/messages' \
--header 'x-api-key: $ANTHROPIC_API_KEY' \
--header 'anthropic-version: 2023-06-01' \
--header 'content-type: application/json' \
--data '{
    "model": "claude-3-5-haiku-latest",
    "max_tokens": 4096,
    "messages": [
        {
            "role": "user",
            "content": "What is the current repo rate?"
        }
    ],
    "tools": [
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5,
            "user_location": {
                "type": "approximate",
                "city": "Chennai",
                "region": "Tamil Nadu",
                "country": "IN",
                "timezone": "Asia/Kolkata"
            }
        }
    ]
}'
```

Make sure to set you `ANTHROPIC_API_KEY` in header

### Response

```json
{
	"id": "msg_01Tod7ZzEymF7QFDKq4QzMCZ",
	"type": "message",
	"role": "assistant",
	"model": "claude-3-5-haiku-20241022",
	"content": [{
			"type": "server_tool_use",
			"id": "srvtoolu_01CB46W1wAsz3DPKJcMaTCsA",
			"name": "web_search",
			"input": {
				"query": "current repo rate India latest"
			}
		},
		{
			"type": "web_search_tool_result",
			"tool_use_id": "srvtoolu_01CB46W1wAsz3DPKJcMaTCsA",
			"content": [{
					"type": "web_search_result",
					"title": "Check Current Repo Rate 03 Jun 2025",
					"url": "https://www.bankbazaar.com/home-loan/repo-rate.html",
					"encrypted_content": "...",
					"page_age": "March 27, 2020"
				},
				{
					"type": "web_search_result",
					"title": "What is Repo Rate and Reverse Repo? Meaning and Differences",
					"url": "https://groww.in/p/tax/repo-rate",
					"encrypted_content": "...",
					"page_age": "April 9, 2025"
				},
				{
					"type": "web_search_result",
					"title": "Current Repo and Reverse Repo Rate 2025: Meaning, Impact & History",
					"url": "https://cleartax.in/s/repo-rate",
					"encrypted_content": "...",
					"page_age": "April 24, 2025"
				},
				{
					"type": "web_search_result",
					"title": "India Interest Rate",
					"url": "https://tradingeconomics.com/india/interest-rate",
					"encrypted_content": "...",
					"page_age": "April 9, 2025"
				},
				{
					"type": "web_search_result",
					"title": "Repo Rate (2025) - Meaning, Current Rates, Difference and Impact",
					"url": "https://www.bajajhousingfinance.in/repo-rate",
					"encrypted_content": "...",
					"page_age": null
				},
				{
					"type": "web_search_result",
					"title": "What is Repo Rate and How Does it Work?",
					"url": "https://www.ujjivansfb.in/banking-blogs/borrow/what-is-repo-rate",
					"encrypted_content": "...",
					"page_age": "4 days ago"
				},
				{
					"type": "web_search_result",
					"title": "Current Repo Rate: RBI Repo Rate Today in India for 2025",
					"url": "https://www.bajajfinserv.in/repo-rate",
					"encrypted_content": "...",
					"page_age": null
				},
				{
					"type": "web_search_result",
					"title": "Reserve Bank of India",
					"url": "https://www.rbi.org.in/commonman/english/scripts/PressReleases.aspx?Id=3311",
					"encrypted_content": "...",
					"page_age": null
				},
				{
					"type": "web_search_result",
					"title": "Press Release:Press Information Bureau",
					"url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2120509",
					"encrypted_content": "...",
					"page_age": "April 9, 2025"
				},
				{
					"type": "web_search_result",
					"title": "Bank Rate vs Repo Rate: What You Really Need to Know",
					"url": "https://www.kotak.com/en/stories-in-focus/loans/home-loan/bank-rate-vs-repo-rate-meaning-and-differences.html",
					"encrypted_content": "...",
					"page_age": "2 weeks ago"
				}
			]
		},
		{
			"type": "text",
			"text": "\n\nBased on the search results, here are the details about the current repo rate:\n\n"
		},
		{
			"citations": [{
					"type": "web_search_result_location",
					"cited_text": "As per the announcement made by the Reserve Bank of India (RBI) on 09 April 2025, the current Repo Rate is 6.00%*. ",
					"url": "https://www.bajajhousingfinance.in/repo-rate",
					"title": "Repo Rate (2025) - Meaning, Current Rates, Difference and Impact",
					"encrypted_index": "..."
				},
				{
					"type": "web_search_result_location",
					"cited_text": "The Reserve Bank of India (RBI) reduced the repo rate by 25 basis points to 6.00% on April 9, 2025.",
					"url": "https://www.bajajfinserv.in/repo-rate",
					"title": "Current Repo Rate: RBI Repo Rate Today in India for 2025",
					"encrypted_index": "..."
				}
			],
			"type": "text",
			"text": "The Reserve Bank of India (RBI) reduced the repo rate to 6.00% on April 9, 2025"
		},
		{
			"type": "text",
			"text": ". Some additional context about this rate:\n\n1. "
		},
		{
			"citations": [{
					"type": "web_search_result_location",
					"cited_text": "This move marks the second rate cut of the year, with the previous cut occurring in February 2025. ",
					"url": "https://cleartax.in/s/repo-rate",
					"title": "Current Repo and Reverse Repo Rate 2025: Meaning, Impact & History",
					"encrypted_index": "..."
				},
				{
					"type": "web_search_result_location",
					"cited_text": "RBI decided to cut the repo rate by 25 bps to 6% from 6.25% second time in the year 2025. The last time the repo rate was changed from 6.50% to 6.25% ...",
					"url": "https://www.bajajfinserv.in/repo-rate",
					"title": "Current Repo Rate: RBI Repo Rate Today in India for 2025",
					"encrypted_index": "..."
				}
			],
			"type": "text",
			"text": "This is the second rate cut of the year, with the previous cut occurring in February 2025 when the rate was reduced from 6.50% to 6.25%"
		},
		{
			"type": "text",
			"text": ".\n\n2. Purpose and Impact:\n- "
		},
		{
			"citations": [{
				"type": "web_search_result_location",
				"cited_text": "The Repo Rate or repurchase rate is the interest rate at which the Central Bank of India (RBI) lends funds to commercial banks to meet short-term fund...",
				"url": "https://www.bajajhousingfinance.in/repo-rate",
				"title": "Repo Rate (2025) - Meaning, Current Rates, Difference and Impact",
				"encrypted_index": "..."
			}],
			"type": "text",
			"text": "The Repo Rate is the interest rate at which the Central Bank of India lends funds to commercial banks to meet short-term fund requirements and control inflation"
		},
		{
			"type": "text",
			"text": ".\n- "
		},
		{
			"citations": [{
				"type": "web_search_result_location",
				"cited_text": "The members of the Monetary Policy Committee (MPC) have collectively decided to bring down the repo rate to 6%, as it is expected to encourage lending...",
				"url": "https://cleartax.in/s/repo-rate",
				"title": "Current Repo and Reverse Repo Rate 2025: Meaning, Impact & History",
				"encrypted_index": "..."
			}],
			"type": "text",
			"text": "The Monetary Policy Committee (MPC) expects this rate cut to encourage lending and investment, stimulate demand, and strengthen overall economic activity"
		},
		{
			"type": "text",
			"text": ".\n\n3. Related Rates:\n- "
		},
		{
			"citations": [{
				"type": "web_search_result_location",
				"cited_text": "The Reverse Repo Rate is 3.35%. The Bank Rate and the Marginal Standing Facility (MSF) rate stand at 6.25%. The Standing Deposit Facility Rate is 5.75...",
				"url": "https://www.bajajhousingfinance.in/repo-rate",
				"title": "Repo Rate (2025) - Meaning, Current Rates, Difference and Impact",
				"encrypted_index": "..."
			}],
			"type": "text",
			"text": "\n- Reverse Repo Rate: 3.35%\n- Bank Rate and Marginal Standing Facility (MSF) rate: 6.25%\n- Standing Deposit Facility Rate: 5.75%\n"
		},
		{
			"type": "text",
			"text": "\n\n4. Economic Implications:\n- "
		},
		{
			"citations": [{
				"type": "web_search_result_location",
				"cited_text": "When the RBI lowers the Repo Rate, commercial banks can enjoy lowered borrowing costs, and the benefit will be passed along to customers. Homeowners’ ...",
				"url": "https://www.bajajhousingfinance.in/repo-rate",
				"title": "Repo Rate (2025) - Meaning, Current Rates, Difference and Impact",
				"encrypted_index": "..."
			}],
			"type": "text",
			"text": "When the Repo Rate is lowered, commercial banks can enjoy reduced borrowing costs, which can lead to lower interest rates for customers, such as reduced home loan rates. Conversely, when the rate rises, borrowing costs increase, leading to higher interest rates"
		},
		{
			"type": "text",
			"text": "."
		}
	],
	"stop_reason": "end_turn",
	"stop_sequence": null,
	"usage": {
		"input_tokens": 14048,
		"cache_creation_input_tokens": 0,
		"cache_read_input_tokens": 0,
		"output_tokens": 476,
		"service_tier": "standard",
		"server_tool_use": {
			"web_search_requests": 1
		}
	}
}

```


> The Reserve Bank of India (RBI) reduced the repo rate to 6.00% on April 9, 2025

We got the correct RBI repo rate in the response
## How does it work?
1. We need to define the tool in our request
2. Claude will determine if web search is needed.
3. If so, it'll search the internet real time (with the preference that you've configured in tool definition)
4. The search result is used for generation

## Supported Models
There models supports web search tool:

| Model             | Version                    |
| ----------------- | -------------------------- |
| Claude Opus 4     | claud-opus-4-20250514      |
| Claude Sonnet 4   | claude-sonnet-4-20250514   |
| Claude Sonnet 3.7 | claude-3-7-sonnet-20250219 |
| Claude Haiku 3.5  | claude-3-5-haiku-latest    |
## Pricing
 - $10 per 1,000 searches
 - We'll also be getting the usage in the API response as well (`server_tool_use.web_search_requests`)

```json
{
  "usage": {
    "input_tokens": 105,
    "output_tokens": 6039,
    "cache_read_input_tokens": 7123,
    "cache_creation_input_tokens": 7345,
    "server_tool_use": {
      "web_search_requests": 1
    }
  }
}
```

## References
- https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool

Happy searching internet!