---
title: "Request Migration Linter"
seo_title: "API Request Migration Linter for Claude Sonnet 5.5, GPT-6 and More (Free, runs in your browser) | AIEngineerGuide"
h1: "Request migration linter"
breadcrumb: "Request migration linter"
app_name: "Request migration linter"
description: "Paste an Anthropic or OpenAI API request, pick the new model, and see every field that will return a 400, with fixes and sources. Free, no signup."
promise: "Paste a request, pick the model you're moving to, and see every field that will be rejected or behave differently, with a fixed request."
tool: model-migration-linter
layout: tool
outputs: ["HTML"]
cta_heading: "Get model retirement alerts and one practical AI engineering note a week"
howto:
  - "Paste the JSON body of an API request, or a Python or TypeScript SDK call (`messages.create`, `chat.completions.create` or `responses.create`) with literal values."
  - "Pick the model you're moving to. If the pasted model is retiring, its official replacement is preselected. For Claude, set your `anthropic-version` and any `anthropic-beta` headers."
  - "Fix each finding, or copy the fixed request. Every rule quotes the official docs, so you can check it yourself."
faq:
  - q: "Why does Claude Sonnet 5.5 return a 400 error for my request?"
    a: "The most common causes are sampling parameters (`temperature`, `top_p`, `top_k`), an assistant prefill, a forced `tool_choice` (`any` or `tool`), `thinking` with `budget_tokens` or `type: disabled`, and a top-level `output_format`. Paste your request above to see which ones apply."
  - q: "Does temperature still work on Claude?"
    a: "Not on Claude Sonnet 5.5, and not on any model when you send `anthropic-version: 2026-10-21`, where `temperature`, `top_p` and `top_k` return a 400 even at their default values. Claude Haiku 5.5 docs say sampling parameters *can* return an error, so omit them there too."
  - q: "How do I replace a forced tool_choice on Claude Sonnet 5.5?"
    a: "Send `tool_choice: {\"type\": \"auto\"}`, mark the tool `strict: true` so its input matches the schema, and tell the model in the prompt when to call it. The linter's fixed request does the first two for you."
  - q: "Can I use function tools with GPT-6 on Chat Completions?"
    a: "On GPT-6 Astra, GPT-6.1 Sol and GPT-6.1 Terra, tool calling requires the Responses API. GPT-6 Sol, GPT-6 Luna and GPT-5.6 support function tools on Chat Completions only with `reasoning_effort: \"none\"`."
  - q: "Is my request sent anywhere?"
    a: "No. Parsing and checks run in your browser. Remove secrets anyway before pasting code."
---

## How the linter works

The linter parses your request (or SDK call), works out which API it targets, and runs every rule for the model you pick. Each rule comes from an official OpenAI or Anthropic page and quotes it, with the date we last checked it. Where the docs quote the exact error message, we show it word for word; where they don't, we say so instead of guessing.

Rules flagged **Returns 400** are documented as HTTP 400. **Rejected** means the docs say the field isn't supported or will raise an error, without naming a status code. **Behavior change** means the request still works but the output changes, such as Claude Sonnet 5.5 thinking by default.

What it can't see: values held in variables, headers your SDK adds for you, and differences on Amazon Bedrock or Vertex AI. It checks the request shape, not your prompts, so run your evaluation set on the new model as well. To find every place your code still calls a retiring model, use the [deprecated model-ID scanner](/tools/model-id-scanner/).

### Sources

- Anthropic: [Claude Sonnet 5.5 migration guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide), [Claude Haiku 5.5 migration guide](https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide), [API version 2026-10-21 migration](https://platform.claude.com/docs/en/api/migration-2026-10-21) (checked 2026-11-02)
- OpenAI: [Latest model guide](https://developers.openai.com/api/docs/guides/latest-model), [Reasoning guide](https://developers.openai.com/api/docs/guides/reasoning), [Upgrading to GPT-5.6](https://developers.openai.com/api/docs/guides/upgrading-to-gpt-5p6-sol), [Chat Completions reference](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) (checked 2026-11-02)
