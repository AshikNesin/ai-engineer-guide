---
title: "Classifier Schema to Decision Questions"
seo_title: "Convert a Classifier Prompt to a Decisions API Request (Free, runs in your browser) | AIEngineerGuide"
h1: "Turn a classifier's structured-output schema into decision questions"
breadcrumb: "Classifier to decisions"
app_name: "Classifier schema to decision questions"
description: "Paste the JSON Schema your LLM classifier uses. See which fields become decision questions (yes/no, choice, score), which stay in an LLM, and get the request for OpenAI, Gemini, Jev or Clef. Free, runs in your browser."
promise: "Paste the structured-output schema, tool definition or bare JSON Schema your classifier uses. Each field becomes a decision question or is marked keep in LLM, and you get the request in the format you pick."
tool: decision-api-converter
mode: migrate
light_only: true
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste your schema. An OpenAI `response_format` or `text.format`, an Anthropic tool `input_schema`, a function tool's `parameters` and a bare JSON Schema all work."
  - "Check the mapping table. Tick **Ordered?** for an enum whose values have an order (low, medium, high) to ask a score question instead of a choice."
  - "Rewrite any placeholder question, then copy the request for the API you picked."
faq:
  - q: "Which classifier fields can a decision API answer?"
    a: "Enums (pick one), booleans (yes/no), small integer ranges or integer enums (score), and arrays of enum values (one yes/no per value). Free text, other numbers and objects without enums need a generative step."
  - q: "What happens to my `confidence` field?"
    a: "It's dropped. Decision APIs return probabilities and confidence for every answer, so you don't ask for them."
  - q: "What about nullable enums?"
    a: "The converter adds an `other` option. OpenAI recommends a fallback option such as `\"other\"` when your categories don't cover every possible input."
---

## How the mapping works

Each leaf of the schema is mapped the same way every time:

| Schema field | Becomes |
|---|---|
| `string` with an `enum` of 2 or more values | Pick one (or score, when you tick **Ordered?**) |
| `boolean` | Yes/no |
| `integer` with `minimum`/`maximum` within 10 levels, or an integer `enum` | Score, one level per value |
| `array` of enum values | One yes/no per value |
| `number` named like `confidence`, `probability` or `certainty` | Dropped: the API returns it |
| Anything else | Keep in an LLM step |

Question keys are the field path joined with `_`, then sanitized for the target API. Questions without a `description` get a placeholder you should rewrite. The `input` is set to `<paste the text you classify>`.

[Convert a request between formats instead](/tools/decision-api-converter/).
