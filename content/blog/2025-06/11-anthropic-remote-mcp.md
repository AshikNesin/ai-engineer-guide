---
title: Using Remote MCP with the Anthropic Messages API
date: 2025-06-11
description: 
tags:
  - anthropic
  - mcp
url: blog/anthropic-remote-mcp
via_url:
---
I recently played around with remote MCP ([MCP connector](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector)) in Anthropic. It allows us to use remote MCP tools at their server during LLM inference. 

Essentially, you can just use their **Messages API** as MCP client 🤯

## Quick Example

When making the API request, we need to define the following MCP servers in the `mcp_servers` array

### Tool definition

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "tool_configuration": {
    "enabled": true,
    "allowed_tools": ["example_tool_1", "example_tool_2"]
  },
  "authorization_token": "YOUR_TOKEN"
}
```

You can read about what each tool does in their [docs](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector#field-descriptions)
### Request
Here is a simple example:

```sh
curl --location 'https://api.anthropic.com/v1/messages' \
--header 'x-api-key: $ANTHROPIC_API_KEY' \
--header 'anthropic-version: 2023-06-01' \
--header 'anthropic-beta: mcp-client-2025-04-04' \
--header 'content-type: application/json' \
--data '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1000,
    "messages": [
        {
            "role": "user",
            "content": "Use tools from zerodha-mcp-server to complete this task. What is the current cost of Gold bees stock?"
        }
    ],
    "mcp_servers": [
        {
            "type": "url",
            "url": "https://mcp.kite.trade/sse",
            "name": "zerodha-mcp-server"
        }
    ]
}'
```

Make sure to set you `ANTHROPIC_API_KEY` in header

### Response

```json
{
    "id": "msg_01DnSioE2Jt79U4TXmyZzr8u",
    "type": "message",
    "role": "assistant",
    "model": "claude-sonnet-4-20250514",
    "content": [
        {
            "type": "text",
            "text": "I'll help you find the current cost of Gold BeES stock. Let me search for the instrument first and then get its current price."
        },
        {
            "type": "mcp_tool_use",
            "id": "mcptoolu_01E6BcPreMRnxwQqG2W4E3fJ",
            "name": "search_instruments",
            "input": {
                "query": "Gold BeES"
            },
            "server_name": "zerodha-mcp-server"
        },
        {
            "type": "mcp_tool_result",
            "tool_use_id": "mcptoolu_01E6BcPreMRnxwQqG2W4E3fJ",
            "is_error": false,
            "content": [
                {
                    "type": "text",
                    "text": "[]"
                }
            ]
        },
        {
            "type": "text",
            "text": "Let me try a more specific search for Gold BeES:"
        },
        {
            "type": "mcp_tool_use",
            "id": "mcptoolu_01W7ochiosETDiPMzz7gHCcN",
            "name": "search_instruments",
            "input": {
                "query": "GOLDBEES"
            },
            "server_name": "zerodha-mcp-server"
        },
        {
            "type": "mcp_tool_result",
            "tool_use_id": "mcptoolu_01W7ochiosETDiPMzz7gHCcN",
            "is_error": false,
            "content": [
                {
                    "type": "text",
                    "text": "[{\"id\":\"BSE:GOLDBEES\",\"instrument_token\":151064324,\"exchange_token\":590095,\"tradingsymbol\":\"GOLDBEES\",\"exchange\":\"BSE\",\"isin\":\"INF204KB17I5\",\"name\":\"NIPPON INDIA ETF GOLD BEES\",\"series\":\"E\",\"last_price\":0,\"strike\":0,\"tick_size\":0.01,\"lot_size\":1,\"multiplier\":-1,\"instrument_type\":\"EQ\",\"segment\":\"BSE\",\"delivery_units\":\"\",\"price_units\":\"\",\"freeze_quantity\":0,\"max_order_quantity\":0,\"expiry_type\":\"\",\"expiry_date\":\"\",\"exercise_start_date\":\"\",\"exercise_end_date\":\"\",\"issue_date\":\"\",\"listing_date\":\"\",\"maturity_date\":\"\",\"lower_circuit_limit\":64.63,\"upper_circuit_limit\":96.94,\"active\":true},{\"id\":\"NSE:GOLDBEES\",\"instrument_token\":3693569,\"exchange_token\":14428,\"tradingsymbol\":\"GOLDBEES\",\"exchange\":\"NSE\",\"isin\":\"INF204KB17I5\",\"name\":\"NIP IND ETF GOLD BEES\",\"series\":\"EQ\",\"last_price\":0,\"strike\":0,\"tick_size\":0.01,\"lot_size\":1,\"multiplier\":-1,\"instrument_type\":\"EQ\",\"segment\":\"NSE\",\"delivery_units\":\"\",\"price_units\":\"\",\"freeze_quantity\":1236862,\"max_order_quantity\":1236862,\"expiry_type\":\"\",\"expiry_date\":\"\",\"exercise_start_date\":\"\",\"exercise_end_date\":\"\",\"issue_date\":\"2007-03-19\",\"listing_date\":\"2007-03-19\",\"maturity_date\":\"\",\"lower_circuit_limit\":64.63,\"upper_circuit_limit\":96.94,\"active\":true}]"
                }
            ]
        },
        {
            "type": "text",
            "text": "Great! I found Gold BeES traded on both NSE and BSE. Now let me get the current price for both exchanges:"
        },
        {
            "type": "mcp_tool_use",
            "id": "mcptoolu_01SC26ymb7KmXG38r39TGKn5",
            "name": "get_ltp",
            "input": {
                "instruments": [
                    "NSE:GOLDBEES",
                    "BSE:GOLDBEES"
                ]
            },
            "server_name": "zerodha-mcp-server"
        },
        {
            "type": "mcp_tool_result",
            "tool_use_id": "mcptoolu_01SC26ymb7KmXG38r39TGKn5",
            "is_error": true,
            "content": [
                {
                    "type": "text",
                    "text": "Please log in first using the login tool"
                }
            ]
        },
        {
            "type": "text",
            "text": "I need to log in first to access the price data. Let me do that:"
        },
        {
            "type": "mcp_tool_use",
            "id": "mcptoolu_01WQfFVPTyDwRuukbtUcuSsD",
            "name": "login",
            "input": {},
            "server_name": "zerodha-mcp-server"
        },
        {
            "type": "mcp_tool_result",
            "tool_use_id": "mcptoolu_01WQfFVPTyDwRuukbtUcuSsD",
            "is_error": false,
            "content": [
                {
                    "type": "text",
                    "text": "Please login to Kite by clicking this link: [Login to Kite](https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3D441375e3-b513-490f-9b86-5372d5312e76%7C1749664397.emD94n6wDqk0LddHu0IhUoiINqYqFInRjP25529F1Sk%3D)\n\nIf your client supports clickable links, you can render and present it and ask them to click the link above. Otherwise, display the URL and ask them to copy and paste it into their browser: https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3D441375e3-b513-490f-9b86-5372d5312e76%7C1749664397.emD94n6wDqk0LddHu0IhUoiINqYqFInRjP25529F1Sk%3D\n\nAfter completing the login in your browser, let me know and I'll continue with your request."
                }
            ]
        },
        {
            "type": "text",
            "text": "To get the current cost of Gold BeES stock, I need you to log in to your Zerodha account first. \n\nPlease click this link to log in: [Login to Kite](https://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3D441375e3-b513-490f-9b86-5372d5312e76%7C1749664397.emD94n6wDqk0LddHu0IhUoiINqYqFInRjP25529F1Sk%3D)\n\nIf the link doesn't work, please copy and paste this URL into your browser:\n```\nhttps://kite.zerodha.com/connect/login?api_key=kitemcp&v=3&redirect_params=session_id%3D441375e3-b513-490f-9b86-5372d5312e76%7C1749664397.emD94n6wDqk0LddHu0IhUoiINqYqFInRjP25529F1Sk%3D\n```\n\nOnce you complete the login process, let me know and I'll get the current price of Gold BeES for you. I found that Gold BeES is available on both NSE and BSE exchanges, so I'll be able to show you the price on both."
        }
    ],
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
        "input_tokens": 23312,
        "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 0,
        "output_tokens": 675,
        "service_tier": "standard",
        "server_tool_use": {
            "web_search_requests": 0
        }
    }
}

```


We got the correct response -- it invoked the mcp tools got some responses from Zerodha MCP server. Their MCP server requires users to manually open the link and verify but as a client it worked as expected.

## References
- https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector

Happy executing tools!