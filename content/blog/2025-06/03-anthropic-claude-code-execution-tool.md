---
title: Anthropic Claude Code Execution Tool via API
date: 2025-06-03
description: 
tags:
  - anthropic
url: blog/anthropic-claude-code-execution-tool
via_url:
---
Anthropic has recently added support for [code execution tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool) (at their server) when making LLM calls. 

It allows LLM to execute **Python** code in secure, sandboxed environment -- No internet access.

Primarily it'll be helpful for processing complex calculations or doing something deterministically which LLM might be be good enough (yet 😜)

## Feature Flag
To use this feature, you need to set [beta header](https://docs.anthropic.com/en/api/beta-headers) 

```yml
"anthropic-beta": "code-execution-2025-05-22"
```

## Quick Example

When making the API request, we need to define the following tool in the tools array

```json
{ 
	"type": "code_execution_20250522",
	"name": "code_execution" 
}
```

### Request
Here is a simple example:

```sh
curl --location 'https://api.anthropic.com/v1/messages' \
--header 'x-api-key: $ANTHROPIC_API_KEY' \
--header 'anthropic-version: 2023-06-01' \
--header 'anthropic-beta: code-execution-2025-05-22' \
--header 'content-type: application/json' \
--data '{
    "model": "claude-3-5-haiku-latest",
    "max_tokens": 4096,
    "messages": [
        {
            "role": "user",
            "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        }
    ],
    "tools": [
        {
            "type": "code_execution_20250522",
            "name": "code_execution"
        }
    ]
}'
```

Make sure to set you `ANTHROPIC_API_KEY` in header

### Response

```json
{
    "id": "msg_01J6NA9KpzkGdqaN9pGA5n8Z",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-haiku-20241022",
    "content": [
        {
            "type": "text",
            "text": "I'll help you calculate the mean and standard deviation of the given list [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] using Python's NumPy library, which is great for statistical calculations."
        },
        {
            "type": "server_tool_use",
            "id": "srvtoolu_01Ji4omgudMBX3jutGap7Ceh",
            "name": "code_execution",
            "input": {
                "code": "import numpy as np\n\n# Define the list\ndata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Calculate mean\nmean = np.mean(data)\n\n# Calculate standard deviation\nstd_dev = np.std(data)\n\nprint(f\"Mean: {mean}\")\nprint(f\"Standard Deviation: {std_dev}\")"
            }
        },
        {
            "type": "code_execution_tool_result",
            "tool_use_id": "srvtoolu_01Ji4omgudMBX3jutGap7Ceh",
            "content": {
                "type": "code_execution_result",
                "stdout": "Mean: 5.5\nStandard Deviation: 2.8722813232690143\n",
                "stderr": "",
                "return_code": 0,
                "content": []
            }
        },
        {
            "type": "text",
            "text": "Let me break down the results:\n- Mean: 5.5 \n  - This is the average of all numbers in the list, calculated by summing all values and dividing by the total count of numbers.\n- Standard Deviation: 2.87 \n  - This measures the amount of variation or dispersion in the dataset. A lower standard deviation indicates that the values tend to be closer to the mean, while a higher standard deviation indicates the values are spread out over a wider range.\n\nIs there anything else you would like to know about these calculations?"
        }
    ],
    "container": {
        "id": "container_011CPmeL2A4TgyKpx2CYV98b",
        "expires_at": "2025-06-03T17:59:49.267116+00:00"
    },
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
        "input_tokens": 1707,
        "cache_creation_input_tokens": 0,
        "cache_read_input_tokens": 0,
        "output_tokens": 332,
        "service_tier": "standard",
        "server_tool_use": {
            "web_search_requests": 0
        }
    }
}
```

### Results

Code execution will return the following things:

| Variable      | Description                                           |
| ------------- | ----------------------------------------------------- |
| `stdout`      | Output from print statements and successful execution |
| `stderr`      | Error messages if code execution fails                |
| `return_code` | 0 for success, non-zero for failure                   |

### Errors
If there is an error using the tool there will be a `code_execution_tool_result_error`

```json
{
	"type": "code_execution_tool_result",
	"tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
	"content": {
		"type": "code_execution_tool_result_error",
		"error_code": "unavailable"
	}
}
```

Possible errors include:

| Error Code                | Description                                 |
| ------------------------- | ------------------------------------------- |
| `unavailable`             | The code execution tool is unavailable      |
| `code_execution_exceeded` | Execution time exceeded the maximum allowed |
| `container_expired`       | The container is expired and not available  |
## How does it work?
1. We need to define the tool in our request
2. Claude will determine if code execution is needed.
3. If so, it'll write the code, run it and then respond back with result (or failure)

## Supported Models
There models supports code execution tool:
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)

## What's the catch?
- It does **NOT** have access to internet -- which might be a deal breaker for most of the use cases
- It's not free. Code execution is tracked separately. 
	- $0.05 per session-hour with minimum of 5 minutes per session (~$0.00415)
	- If files are included in the request, then execution time is billed even if the code execution tool does not gets executed (they claim that they upload the file to the container)

You can read more about containers, pre-installed libraries, file handling in their docs

## Random Thoughts
- With features like these AI companies are slowly becoming platform. And inevitability vendor lock-in comes into the picture. 
- And yeah, for production application it would be better to build this feature on top of providers like https://modal.com that will give us more control like having access to internet, installing custom package, etc.
## References
- https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool

Happy code execution!