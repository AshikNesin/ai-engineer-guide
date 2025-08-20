---
title: Automatically fetch URL content on Google's Gemini Models
url: blog/fetch-url-content-on-google-gemini-models
tags:
  - google-gemini
status: published
date: 2025-08-19T00:00:00.000Z
qblog_id: c5dac5f5-0c94-40ba-b670-086babc4b285
---

Google's Gemini LLM can now have support for automatically fetching contents from URL using their `URL context tool`

It's similar to the web search tool provided by OpenAI and other providers but here you give the explicit URL and the AI model will fetch it on its end.

By doing so, you avoid having to fetch the content on your end (saving network bandwidth) and having to pass it to AI models manually.

## Use Cases
- Extracting **real-time data** from a web page like fetching price
- Give more context for coding. Like for example, you can pass tech doc
- Combining data from different sources to create a content

## Example
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
      "contents": [
          {
              "parts": [
                  {"text": "What are the recent posts in https://aiengineerguide.com in markdown format with link to it ?"}
              ]
          }
      ],
      "tools": [
          {
              "url_context": {}
          }
      ]
      }'
```
Make sure to replace this with your `GEMINI_API_KEY`

<details>
  <summary>Response</summary>

  ```json
  {
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Here are the recent posts from AIEngineerGuide.com:\n\n*   [OpenAI's Cheatsheet for Coding with GPT-5](https://aiengineerguide.com) (August 18, 2025)\n*   [Perplexity Pro Users Get $5 Free LLM API Credits Every Month](https://aiengineerguide.com) (August 17, 2025)\n*   [Gemini CLI Custom Slash Commands](https://aiengineerguide.com) (August 16, 2025)\n*   [Gemma 3 270M - Google's Lightweight On‑Device Model](https://aiengineerguide.com) (August 15, 2025)\n*   [How to build app like Loveable](https://aiengineerguide.com) (August 14, 2025)"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "groundingMetadata": {
        "groundingChunks": [
          {
            "web": {
              "uri": "https://aiengineerguide.com",
              "title": "AI Engineer Guide"
            }
          }
        ],
        "groundingSupports": [
          {
            "segment": {
              "startIndex": 1,
              "endIndex": 52,
              "text": "Here are the recent posts from AIEngineerGuide.com:"
            },
            "groundingChunkIndices": [
              0
            ]
          },
          {
            "segment": {
              "startIndex": 54,
              "endIndex": 148,
              "text": "*   [OpenAI's Cheatsheet for Coding with GPT-5](https://aiengineerguide.com) (August 18, 2025)"
            },
            "groundingChunkIndices": [
              0
            ]
          },
          {
            "segment": {
              "startIndex": 149,
              "endIndex": 262,
              "text": "*   [Perplexity Pro Users Get $5 Free LLM API Credits Every Month](https://aiengineerguide.com) (August 17, 2025)"
            },
            "groundingChunkIndices": [
              0
            ]
          },
          {
            "segment": {
              "startIndex": 263,
              "endIndex": 348,
              "text": "*   [Gemini CLI Custom Slash Commands](https://aiengineerguide.com) (August 16, 2025)"
            },
            "groundingChunkIndices": [
              0
            ]
          },
          {
            "segment": {
              "startIndex": 349,
              "endIndex": 455,
              "text": "*   [Gemma 3 270M - Google's Lightweight On‑Device Model](https://aiengineerguide.com) (August 15, 2025)"
            },
            "groundingChunkIndices": [
              0
            ]
          },
          {
            "segment": {
              "startIndex": 456,
              "endIndex": 539,
              "text": "*   [How to build app like Loveable](https://aiengineerguide.com) (August 14, 2025)"
            },
            "groundingChunkIndices": [
              0
            ]
          }
        ]
      },
      "urlContextMetadata": {
        "urlMetadata": [
          {
            "retrievedUrl": "https://aiengineerguide.com",
            "urlRetrievalStatus": "URL_RETRIEVAL_STATUS_SUCCESS"
          }
        ]
      }
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 21,
    "candidatesTokenCount": 212,
    "totalTokenCount": 584,
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 21
      }
    ],
    "toolUsePromptTokenCount": 279,
    "toolUsePromptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 279
      }
    ],
    "thoughtsTokenCount": 72
  },
  "modelVersion": "gemini-2.5-flash",
  "responseId": "hrqkaPKeFrTRz7IP8s3JgQw"
}
```

</details>

### What's in the response?
When you use URL context tool, you'll be getting `url_context_metadata` object in the response.

It has `url_metadata` in it which you can use to verify whether the URL is successfully loaded or not.

```json
{
  "candidates": [
    {
      ...
      "urlContextMetadata": {
        "urlMetadata": [
          {
            "retrievedUrl": "https://example.com",
            "urlRetrievalStatus": "URL_RETRIEVAL_STATUS_SUCCESS"
          },
          {
            "retrievedUrl": "https://example2.com",
            "urlRetrievalStatus": "URL_RETRIEVAL_STATUS_ERROR"
          }
        ]
      }
    }
}

```
And these are the possible values for `urlRetrievalStatus`

| Enum                             | Description                                                        |
|----------------------------------|--------------------------------------------------------------------|
| `URL_RETRIEVAL_STATUS_UNSPECIFIED` | Default value. This value is unused.                               |
| `URL_RETRIEVAL_STATUS_SUCCESS`     | URL retrieval is successful.                                       |
| `URL_RETRIEVAL_STATUS_ERROR`       | URL retrieval failed due to error.                                 |
| `URL_RETRIEVAL_STATUS_PAYWALL`     | URL retrieval failed because the content is behind a paywall.      |
| `URL_RETRIEVAL_STATUS_UNSAFE`      | URL retrieval failed because the content is unsafe.                |

You also get **usage** metadata in it as well

```json
{
  "usageMetadata": {
    "promptTokenCount": 21,
    "candidatesTokenCount": 212,
    "totalTokenCount": 584,
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 21
      }
    ],
    "toolUsePromptTokenCount": 279,
    "toolUsePromptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 279
      }
    ],
    "thoughtsTokenCount": 72
  }
}
  ```
Refer to [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) for more details about pricing of each models

## Supported Models
Currently this feature is supported in the following models
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.5-flash-lite
- gemini-live-2.5-flash-preview
- gemini-2.0-flash-live-001

## Limitations
- Content retrieved from URLs counts as input tokens.
- As of now, only status HTML are passed as content. (No support for JS rendered page yet)
- It can have up to 20 URL in a single request.
- Max content retrieved from a single URL is 34MB.

## Supported Content Type
![2025-08-19-at-23.45.062x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-08/uha7tunfxusjv3bnp5az)

## References
- [URL context  |  Gemini API  |  Google AI for Developers](https://ai.google.dev/gemini-api/docs/url-context#rest_1)