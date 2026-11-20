---
title: "Decision API Converter"
seo_title: "Decision API Converter: OpenAI Decisions, Gemini Decisions and Jev/Clef (Free, runs in your browser) | AIEngineerGuide"
h1: "Decision API converter: OpenAI, Gemini and System One (Jev, Clef)"
breadcrumb: "Decision API converter"
app_name: "Decision API converter"
description: "Convert a decision request between OpenAI Decisions, Gemini Decisions, TypeSafe Jev and Cloudflare Clef. Get the converted JSON, a curl snippet and a warning for every lossy step. Free, runs in your browser."
promise: "Paste a decision request and pick the target API. Get the converted request, a curl snippet with placeholder keys, and a warning for every step that loses something: option order, criteria, limits, unsupported input."
tool: decision-api-converter
mode: convert
layout: tool
light_only: true
outputs: ["HTML"]
cascade:
  light_only: true
cta_heading: "Get one practical AI engineering note a week"
howto:
  - "Paste a decision request body. The format is detected: a `questions` array is OpenAI, a `questions` map with `input` is Gemini, and `state` is System One. Or pick it in **From**."
  - "Pick the target in **To**: OpenAI, Gemini, Jev or Clef."
  - "Read the warnings, grouped by question, then **Copy JSON** or **Copy curl**. The curl uses `$ENV_VAR` placeholders, never a real key."
faq:
  - q: "What's the difference between `predicate` and `noul`?"
    a: "Both are yes/no questions. OpenAI calls it `predicate` and answers with a `probability`. Gemini and System One call it `noul` and answer with a `noul` value (0.01–0.99 on Gemini). OpenAI predicates have no criteria field, so the converter folds Gemini's or System One's yes/no definitions into `instructions` and warns you."
  - q: "Why did my option order change when converting to Gemini?"
    a: "Gemini takes options as a `criteria` map and sorts the keys alphabetically in UTF-8 byte order, so your order isn't kept. If the order carries meaning, use a `score` question instead."
  - q: "Can I send conversation history to Gemini Decisions?"
    a: "No. Google's docs say conversation history, thought and tool-call blocks aren't supported and to serialize multi-turn context as text. The converter does that and warns you."
  - q: "Is the Gemini Decisions REST path confirmed?"
    a: "Not yet. The SDK call is documented, but the REST path we use comes from third-party posts. The curl snippet says so in a comment. Check Google's API reference before you rely on it."
  - q: "Is what I paste sent anywhere?"
    a: "No. Conversion runs in your browser and the page makes no network requests with your input. It isn't stored or put in the URL."
---

## How the converter works

It reads your request into one shared shape (yes/no, pick one, ordered rubric, plus the input), then writes it out in the target format. Each step that can't carry something across adds a warning, most with a link to the provider's docs:

- **Yes/no criteria.** OpenAI predicates have no criteria, so Gemini's or System One's definitions are folded into `instructions`.
- **Option order.** Gemini sorts option keys alphabetically. OpenAI keeps an array in your order.
- **Rubrics.** OpenAI levels are `{label, description}`; Gemini and System One take a list of strings, so labels and descriptions are merged or split.
- **Limits.** Question, option and level counts are checked against each target's documented limits, and question keys are sanitized to the target's allowed characters.
- **Input.** OpenAI `input_json` and conversation history are serialized to text for Gemini; images and other media need a manual step; Jev's `box` question has no equivalent elsewhere.

Not sure a decision API fits? [Turn your classifier schema into decision questions](/tools/decision-api-converter/classifier-to-decisions/) and see which fields still need an LLM.

## How we check this

Format details come from the providers' docs (quoted on each format pair page), checked {{< decision-checked >}}. Where the docs don't confirm something (the Gemini REST path, the Jev auth header and question limit, Clef's response wrapper), the converter says so instead of guessing.
