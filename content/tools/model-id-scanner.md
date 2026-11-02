---
title: "Deprecated Model-ID Scanner"
seo_title: "Deprecated LLM Model-ID Scanner for Code and n8n Workflows (Free, runs in your browser) | AIEngineerGuide"
h1: "Deprecated model-ID scanner"
breadcrumb: "Model-ID scanner"
app_name: "Deprecated model-ID scanner"
description: "Paste code, config or an n8n workflow to find every deprecated or retired OpenAI, Claude and Gemini model ID, with days left. Free, no signup."
promise: "Paste code, a config file or an n8n workflow and find every model ID that's retiring or already retired, with days left and the official replacement."
tool: model-id-scanner
cta_heading: "Get model retirement alerts and one practical AI engineering note a week"
howto:
  - "Paste code, an `.env` or config file, or an n8n/automation workflow export, or drop several files at once."
  - "Read the list: retired models first (their requests already fail), then the soonest shutdowns, with the line numbers where each ID appears."
  - "Copy the result as a checklist for your issue tracker, and use the [request migration linter](/tools/model-migration-linter/) to check each request against its new model."
faq:
  - q: "How do I find which deprecated OpenAI or Claude models my code uses?"
    a: "Paste your code or config here, or drop the files. The scanner finds every model ID and checks it against the official OpenAI, Anthropic and Gemini API deprecation pages. Nothing is uploaded."
  - q: "Does it work with n8n, Make or Zapier workflows?"
    a: "Yes for any export that contains model IDs as text, such as n8n workflow JSON. Paste the export and the scanner finds the model IDs in it."
  - q: "Does it catch aliases like gpt-4o or claude-sonnet-4-5?"
    a: "Yes. Providers' tables often list dated snapshots (`gpt-4o-2024-08-06`, `claude-sonnet-4-5-20250929`). The scanner also flags the undated alias and labels it as an alias. It also understands `models/`, `openai/`, Amazon Bedrock (`anthropic.…-v1:0`) and Vertex AI (`…@date`) spellings."
  - q: "Why isn't my active model flagged?"
    a: "Only models the providers have deprecated or retired are flagged. Anthropic's \"not sooner than\" dates for active models are minimum lifetimes, not retirement dates."
  - q: "How is this different from a GitHub app or CLI scanner?"
    a: "There's nothing to install and no repository access: paste text or drop files and it runs in your browser."
---

## How the scanner works

It finds every model-ID-shaped string in your text, normalizes platform spellings (`models/gemini-2.0-flash`, `openai/gpt-4o`, `anthropic.claude-3-5-sonnet-20240620-v1:0`, `claude-sonnet-4-5@20250929`), and looks each one up in our [model retirement data](/tools/model-retirements/). That data is parsed daily from the official [OpenAI](https://developers.openai.com/api/docs/deprecations), [Anthropic](https://platform.claude.com/docs/en/about-claude/model-deprecations) and [Gemini API](https://ai.google.dev/gemini-api/docs/deprecations) deprecation pages, and every date change is reviewed before it's published.

An exact match means the ID appears in the provider's table. An alias match means it's the same ID without its date suffix (for example `gpt-4o` for `gpt-4o-2024-08-06`); providers usually point those aliases at the listed snapshots, so they're flagged too and labelled. Dates are for each provider's own API; Amazon Bedrock and Vertex AI publish their own schedules.

It can't see model names built at runtime (for example from environment variables), so also search your deployment config.
