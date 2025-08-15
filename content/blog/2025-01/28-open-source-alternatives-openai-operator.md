---
title: Open Source Alternatives to OpenAI Operator
date: 2025-01-28
description: 
tags:
  - bookmark
  - OpenAI
  - OpenAI-Operator
  - browser-base
  - browser-use
  - chromium
url: blog/open-source-alternatives-openai-operator
---
[Operator](https://openai.com/index/introducing-operator/) is one of the **interesting** feature that is released by OpenAI recently. It has the capabilities to access to remote browser (with internet) and can perform task for you. Under the hood it uses  [Computer-Using Agent](https://openai.com/index/computer-using-agent/) 

Though I didn't get access to try it myself, the demo that is presented by the OpenAI team looks promising.

Essentially it works by passing the screenshot and asking the LLM for next action. You can have a look at their [system prompt](/blog/26-openai-operator-prompt)

Here are some of the open source alternative to OpenAI Operator that mimics browser searching capabilities

## Open Operator by Browserbase

It's  an PoC application built by the Browserbase team to show how someone can leverage their open source library [Stagehand](https://www.stagehand.dev/) and their hosted browser as service - [Browserbase](https://www.browserbase.com/)

The app itself is built on Next.js and currently supports only OpenAI's `gpt-4o` model

You can learn about how they're prompting and interacting with stagehand+Browserbase [here](https://github.com/browserbase/open-operator/blob/main/app/api/agent/route.ts)

| **Resource** | **Link** |
| --- | --- |
| App | [https://operator.browserbase.com/](https://operator.browserbase.com/) |
| Source Code | [https://github.com/browserbase/open-operator](https://github.com/browserbase/open-operator) |
| License | stagehand - MIT, OpenOperator - MIT |
Here is a quick demo of the app by [Paul Klein IV](https://x.com/pk_iv) (co-founder of Browserbase)


{{< video "https://res.cloudinary.com/ashiknesin/video/upload/AIEngineeringGuide.com/static/open-operator-demo.mp4"  >}}

> Note: I tried it with couple of queries and in some case it was kind of slow and got killed before getting the result (session timeout maybe?). Given that this is just a PoC not an application like OpenAI's Operator it is so 🙌. I really like their slick UI.

## Web UI by Browser Use

Similar to OpenOperator, this in built on top of [browser-use](https://github.com/browser-use/browser-use) - a open source, MIT licensed library for building AI agents to perform some action on the browser.

In terms of the tech stack, the app is built using [gradio](https://www.gradio.app/). Unlike OpenOperator, it has support for multiple LLM like Gemini, OpenAI, Azure OpenAI, Anthropic, DeepSeek, Ollama, etc.

And it also have lot of extra customisability as well (eg: Persistent Browser Sessions) 


| **Resource** | **Link** |
| --- | --- |
| Source Code | [web-ui](https://github.com/browser-use/web-ui) |
| License | MIT |

Here is a quick demo of it by Addy Osmani

{{< video "https://res.cloudinary.com/ashiknesin/video/upload/AIEngineeringGuide.com/static/web-ui-by-browser-use.mp4"  >}}

## surf.new by Steel.dev
Similar to Browserbase, [Steel.dev](https://steel.dev) also provides browser as service. 
And [surf.dev](https://surf.new) is a playground to the capabilities of their platform.

For the query
> Compare Windsurf and Cursor. Give me the list of features that it provides and also cost and other things in markdown format

```markdown
Here's the formatted markdown:

### Windsurf vs Cursor Comparison 

#### Windsurf
- Hobby Plan: Free
  - Includes:
    - Pro two-week trial
    - 2000 completions
    - 50 slow premium requests
- Pro Plan: $20/month
  - Everything in Hobby, plus:
    - Unlimited completions
    - 500 fast premium requests/month
    - Unlimited slow premium requests
    - 10 on-limit uses per day
- Business Plan: $40/user/month
  - Everything in Pro, plus:
    - Private privacy mode
    - 600+ video
    - Centralized team billing
    - Admin dashboard with usage stats
    - 30-day SOC2 ISO

#### Cursor
- Free Plan: $0/month, forever
  - Cascade credits:
    - Free one-time trial gift on download
    - 50 premium model User Prompt and 200 premium Flow Action credits
    - 5 premium model User Prompt credits
    - 5 premium model Flow Action credits
    - Access to Cascade Base model
- Pro Plan: $15/month
  - Cascade credits:
    - 500 premium model User Prompt credits
    - 1,500 premium model Flow Action credits
    - Can purchase more premium model credits
    - Priority unlimited access to Cascade Base Model
- Pro Ultimate Plan: $60/month
  - Cascade credits:
    - Infinite premium model User Prompt credits
    - 3,000 premium model Flow Action credits
    - Priority unlimited access to Cascade Base Model

```

![2025-02-07 at 09.31.36@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-01/2025-02-07-at-09.31.36-at-2x.png)

| **Resource** | **Link**                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| App          | [surf.new](https://surf.new)                                                                                         |
| Source Code  | - [steel-browser](https://github.com/steel-dev/steel-browser)<br>- [surf.new](https://github.com/steel-dev/surf.new) |
| License      | - steel-browser -  Apache-2.0<br>- surf.new - MIT                                                                    |

### Credits

The video demo in the blog post is from these Tweets

- https://x.com/pk_iv/status/1882837641521221858
- https://x.com/addyosmani/status/1878245455223767314

Happy automating browser!
