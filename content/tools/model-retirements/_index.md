---
title: "AI Model Retirement Calendar"
seo_title: "AI Model Deprecation & Retirement Calendar: OpenAI, Claude, Gemini | AIEngineerGuide"
h1: "AI model retirement calendar"
breadcrumb: "Model retirements"
app_name: "AI model retirement calendar"
description: "Free calendar of every upcoming OpenAI, Anthropic Claude and Gemini API model shutdown, with days left, replacements and .ics/RSS alerts. No signup."
promise: "Every upcoming OpenAI, Claude and Gemini API model shutdown in one list, with days left and the recommended replacement."
tool: model-retirements
type: retirements
outputs: ["HTML", "Calendar", "RetirementsRSS"]
show_feeds: true
cta_heading: "Get model retirement alerts and one practical AI engineering note a week"
howto:
  - "Filter by provider or search for the model ID you call in production, such as `gpt-4o-2024-08-06`."
  - "Open a model to see its replacement, breaking changes and a migration checklist."
  - "Subscribe to the calendar feed or RSS so new shutdowns and date changes reach you."
faq:
  - q: "Where do these retirement dates come from?"
    a: "Only from the official deprecation pages of [OpenAI](https://developers.openai.com/api/docs/deprecations), [Anthropic](https://platform.claude.com/docs/en/about-claude/model-deprecations) and the [Gemini API](https://ai.google.dev/gemini-api/docs/deprecations). A daily job re-reads them and every date change is reviewed before it's published."
  - q: "What's the difference between deprecated and retired?"
    a: "A deprecated model still works but has an announced shutdown date and a recommended replacement. A retired model is shut down, and requests to it fail."
  - q: "Why do Gemini dates say \"earliest possible\"?"
    a: "Google lists the earliest date a Gemini API model might be shut down and announces the exact date later. We label those dates \"earliest\" on the calendar."
  - q: "Do these dates apply to Amazon Bedrock, Vertex AI or Azure?"
    a: "No. The dates are for each provider's own API. Amazon Bedrock, Google Cloud Vertex AI and Azure OpenAI publish their own schedules, which can differ."
  - q: "How do I get alerts when a model I use is deprecated?"
    a: "Subscribe to the calendar feed (.ics) in Google Calendar, Apple Calendar or Outlook, which adds every shutdown with reminders 30 and 7 days before, or follow the RSS feed for new announcements and date changes."
  - q: "Why isn't an active model like Claude Opus 5.5 on the calendar?"
    a: "Anthropic lists active models with a \"not sooner than\" date. That's a minimum lifetime, not a retirement date, so it never goes on the calendar."
---
