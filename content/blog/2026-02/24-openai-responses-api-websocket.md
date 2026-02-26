---
title: How to use OpenAI Responses API with WebSocket
url: blog/openai-responses-api-websocket
tags:
  - OpenAI
  - websocket
status: published
date: 2026-02-24T00:00:00.000Z
---
OpenAI has support for web sockets for their Responses API.

This helps to improve the latency by avoiding unwanted handshakes that is involved in HTTP requests.

> The Responses API supports a WebSocket mode for long-running, tool-call-heavy workflows. In this mode, you keep a persistent connection to /v1/responses and continue each turn by sending only new input items plus previous_response_id.


{{< video  "https://video.twimg.com/amplify_video/2026025302938529792/vid/avc1/960x720/nBBYDYhNt4Qc8uoe.mp4?tag=14" >}}

## Example Snippet
```python
from websocket import create_connection
import json
import os

ws = create_connection(
    "wss://api.openai.com/v1/responses",
    header=[
        f"Authorization: Bearer {os.environ['OPENAI_API_KEY']}",
    ],
)

ws.send(
    json.dumps(
        {
            "type": "response.create",
            "model": "gpt-5.2",
            "store": False,
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Find fizz_buzz()"}],
                }
            ],
            "tools": [],
        }
    )
)
```

## Reference
- https://developers.openai.com/api/docs/guides/websocket-mode
