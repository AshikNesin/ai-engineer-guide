---
title: How to use OpenRouter's PDF Input
url: blog/openrouter-pdf
tags:
  - openrouter
status: published
date: 2025-08-04T00:00:00.000Z
description: null
qblog_id: 7b85650f-54a6-40ae-983f-4bbe191e460b
via_url: null
---

When working with LLM you might want to use the PDF file like bank statements, contracts, etc and perform some action on top of it.

Nowadays majority of the models supports it but it'll ask you to upload the file in base64.

However, OpenRouter has came up with a way using which you can use the PDF feature even for the models that does not support it.

## Input Types
You can send the PDF file as either **direct URL** or **base64-encoded data** in the messages.

## How does it work?
If you give direct URL, then it'll download public pdf URL and then use it for processing the file.

Currently it has support for three engines

| PDF Processing Engine | Description                                                | Cost                    |
| --------------------- | ---------------------------------------------------------- | ----------------------- |
| mistral-ocr           | Best for scanned documents or PDFs with images             | $2 per 1,000 pages      |
| pdf-text              | Best for well-structured PDFs with clear text content      | Free                    |
| native                | Only available for models that support file input natively | charged as input tokens |

For the models that supports PDF out of box, you can consider using `native` engine itself.

If the engine is not specified, then  it'll first try to use model’s native file processing capabilities. If it is not available then `mistral-ocr` will be used.

## Example

```python
import requests
import json

url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {API_KEY_REF}",
    "Content-Type": "application/json"
}

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "What are the main points in this document?"
            },
            {
                "type": "file",
                "file": {
                    "filename": "document.pdf",
                    "file_data": "https://arxiv.org/pdf/1706.03762"
                }
            },
        ]
    }
]

# Optional: Configure PDF processing engine
plugins = [
    {
        "id": "file-parser",
        "pdf": {
            "engine": "mistral-ocr"
        }
    }
]

payload = {
    "model": "anthropic/claude-sonnet-4",
    "messages": messages,
    "plugins": plugins
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())

```

## Credits
[OpenRouter PDF Inputs | Complete Documentation | OpenRouter | Documentation](https://openrouter.ai/docs/features/multimodal/pdfs#using-pdf-urls)

Happy PDF upload!