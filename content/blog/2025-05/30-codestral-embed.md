---
title: Code Embeddings with Codestral Embed by Mistral
date: 2025-05-30
description: 
tags:
  - bookmark
  - mistral
  - codestral-embed
  - embedding
url: blog/codestral-embed
via_url:
---
Mistral has recently launched [Codestral Embed](https://mistral.ai/news/codestral-embed) which they've trained specifically for code.

They claim 👇

> Codestral Embed significantly outperforms leading code embedders in the market today: Voyage Code 3, Cohere Embed v4.0 and OpenAI’s large embedding model.

You can use it by specifying `codestral-embed` as model name 

When generating embedding you can configure both the `output_dimension` and `output_dtype`

### Output DType
`output_dtype` allows you to get the **precision and format** of the embeddings. Using it you can get your desired level of numerical accuracy and representation.

These are the types they've mentioned in their [API docs ](https://docs.mistral.ai/capabilities/embeddings/code_embeddings/#output-dtype)

| DType   | Description |
|---------|-------------|
| `float` (default) | A list of 32-bit (4-byte) single-precision floating-point numbers. Provides the highest precision and retrieval accuracy. |
| `int8`  | A list of 8-bit (1-byte) integers ranging from -128 to 127. |
| `uint8` | A list of 8-bit (1-byte) integers ranging from 0 to 255. |
| `binary` | A list of 8-bit integers that represent bit-packed, quantized single-bit embedding values using the `int8` type. The length of the returned list of integers is 1/8 of `output_dimension`. This type uses the offset binary method. |
| `ubinary` | Similar to `binary`, but uses the `uint8` type for bit-packed, quantized single-bit embedding values. |

### Output Dimension
The model's output dimension is flexible in nature. You can configure the output dimension that you want (defaults to **1536** and **maximum value of 3072**)

> For any integer target dimension n, you can choose to retain the first n dimensions. These dimensions are ordered by relevance, and the first n are selected for a smooth trade-off between quality and cost.

## Example

```shell
problem_description = "Given two numbers, return their sum. Example: Input: a = 3, b = 5 Output: 8"

solution = "def add_numbers(a, b): return a + b"

curl -X POST "https://api.mistral.ai/v1/embeddings" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer ${API_KEY}" \
     -d '{
           "model": "codestral-embed",
           "output_dimension": 10,
           "output_dtype": "float",
           "input": [
             "'"$problem_description"'",
             "'"$solution"'"
           ]
         }' \
     -o embedding.json
```

## Use cases

Codestral Embed is designed to excel in **code retrieval and semantic understanding**. According to their website, some key use cases include:
- RAG
- Searching code semantically
- Detecting duplicates and similarities
- Analyzing code through semantic clustering
## What's the catch?
>Codestral Embed is available on our API under the name `codestral-embed-2505` at a price of $0.15 per million tokens. It is also available on our [batch API](https://docs.mistral.ai/capabilities/batch/) at a 50% discount.

It does not provide open weights. You can use it via their API only. 

If you want open weights code embed model, you can try something like [nomic-embed-code](https://huggingface.co/nomic-ai/nomic-embed-code) or [jina-embeddings-v2-base-code](https://huggingface.co/jinaai/jina-embeddings-v2-base-code) 
## References
- [Mistral API Docs]( https://docs.mistral.ai/capabilities/embeddings/code_embeddings/#output-dimension)
- [Codestral Embed Release](https://mistral.ai/news/codestral-embed)
- [Simon Willison's Weblog](https://simonwillison.net/2025/May/28/codestral-embed/)

Happy embedding code!