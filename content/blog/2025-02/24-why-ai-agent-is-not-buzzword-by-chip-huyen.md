---
title: "TLDR: Why AI Agent is not buzzword by Chip Huyen"
date: 2025-02-24
description: 
tags:
  - tldr
  - talk
  - notes
  - chip-huyen
url: blog/why-ai-agent-is-not-buzzword-by-chip-huyen
via_url: https://www.youtube.com/watch?v=D6v5rlqUIc8&ab_channel=AIEngineer
---
I recently came across  Chip Huyen's talk on [Why people think "agent" is a buzzword but it isn't](https://www.youtube.com/watch?v=D6v5rlqUIc8&ab_channel=AIEngineer)
At a high level, she has talked about key challenges in building a AI Agent and how we can potentially address it.

I highly recommend you to check that talk to get full gist of it. 

Let's get started 👇

---
## What's an agent?
Anything that perceives environment and acts on the environment.

![2025-02-24 at 09.05.53@2x.png](/images/2025-02-24-at-09.05.53-at-2x.png)


| **Agent** | **Environment** | **Actions** | **Interaction** |
| --- | --- | --- | --- |
| Chess-playing program | Chessboard | Plays chess | Interacts with chessboard |
| [Coding agents](https://arxiv.org/pdf/2405.15793) | Computer terminals and file systems | Interacts with terminals and file systems | Interacts with computer terminals and file systems |
| Language model | Text | Processes text | Interacts with text |
| Language model (with access to image captioning model) | Text and Images | Processes text and images | Interacts with text and images |

> Giving a model more actions expands its environment and environment determines kind of a action an Agent can perform

![2025-02-24 at 09.09.55@2x.png](/images/2025-02-24-at-09.09.55-at-2x.png)

### Why Use Agents?
- **Address Model Limitations**: Actions help overcome limitations such as knowledge cut-off dates by accessing real-time information via APIs
- **Create Multimodal Models**: Agents can turn text or image-only models into multimodal models by giving them access to tools that process different types of data (image to caption, pdf to text, etc)
- **Embed Models into Workflows**: Agents can be integrated into daily tasks by giving them access to tools like inboxes and calendars
	- Access to email, cal, IDE, etc

### Challenges of Building Agents

Despite the potential, building agents is challenging:
#### Complexity (Curse of complexity 😅)
- Complexity 👉  Number of steps needed to solve a task.
- Task failure rates increases as task complexity grows. Many agents use multiple steps which in-turn increases the likelihood of failure. (Not just for AI even human tasks) 

![2025-02-24 at 09.16.50.png](/images/2025-02-24-at-09.16.50.png)

- It's kind of chicken-and-egg problem: An agent often need to perform multiple steps to accomplish a task
	- Simple tasks don't need agents
	- Simple tasks have low economic values

**Example:**

Though the question seems simple, under the hood a agent need to perform multiple steps

| **Task** | **Plan** |
| --- | --- |
| How many people bought products from company X last week? | 1. getProductList<br>2. getOrderCount<br>3. sum<br>4. generateResponse |

> Most successful agent -- use cases involve <= 5 steps

Prediction: Enabling agents to handle more complexity will unlock many new use uses.

![2025-02-24 at 09.22.23.png](/images/2025-02-24-at-09.22.23.png)

![2025-02-24 at 09.22.59.png](/images/2025-02-24-at-09.22.59.png)

In her benchmark, Most models can solve at most 5 steps and after 10 steps most model will fail.


And **new models** are getting better 💪

![2025-02-28 at 12.46.39.png](/images/2025-02-28-at-12.46.39.png)

![2025-02-24 at 09.26.25@2x.png](/images/2025-02-24-at-09.26.25-at-2x.png)

![2025-02-24 at 09.26.55@2x.png](/images/2025-02-24-at-09.26.55-at-2x.png)

### [Tip] How to make Agent handle more complex tasks? 
1. Break tasks into sub tasks that agent can solve.
	- If a task requires 6 steps and agent can only plan 3 step ahead, break the task into 2 subtasks
2. Test-time compute scaling - Give model more processing power during inference (reasoning models) so that it can use more compute tokens, so it can think more. Generate more results and pick the one that is more relavent.
3. Use stronger models - Train time compute scaling

## Tool Use 🔨

**What is tool use?**
It's like a Natural Language <> API translation. 
 ![2025-02-24 at 09.30.22@2x.png](/images/2025-02-24-at-09.30.22-at-2x.png)

Challenges comes from both sides of the translation: 
1. Natural language is extremely ambiguous
2. On API side, we might have very bad API or very bad documentations

![2025-02-24 at 09.31.15@2x.png](/images/2025-02-24-at-09.31.15-at-2x.png)



![2025-02-24 at 09.32.20@2x.png](/images/2025-02-24-at-09.32.20-at-2x.png)

Example: Even though the question "Find best selling products under $10" seems straightforward it has lot of [nuances](https://www.youtube.com/embed/D6v5rlqUIc8?si=XNU4k_mU4kd3AUS2&amp;clip=UgkxailyW_vBYRXdgSGA89TslnxU-6A7rUX8&amp;clipt=EKCpNhjn1Tk) under the hood.

#### Documentation ✍️


> If we cant explain the functionality to the AI agent. It is going to be really really hard for the agent to pick the right one

![2025-02-24 at 09.34.55@2x.png](/images/2025-02-24-at-09.34.55-at-2x.png)

![2025-02-24 at 09.35.55@2x.png](/images/2025-02-24-at-09.35.55-at-2x.png)
Interpret model response
![2025-02-24 at 09.36.28@2x.png](/images/2025-02-24-at-09.36.28-at-2x.png)

![2025-02-24 at 09.36.59@2x.png](/images/2025-02-24-at-09.36.59-at-2x.png)

Given a task, what the human annotator does might not be optimal for AI

![2025-02-24 at 09.39.20@2x.png](/images/2025-02-24-at-09.39.20-at-2x.png)

### [Tip] How to make agent better at tool use?
1. Create **very good** documentation with function descriptions, parameter details, and error codes
2. Give agents narrow, well-defined functions
3. Use query rewriting and intent classifiers to resolve ambiguity
4. Instruct agent to ask for clarification when unsure
5. Build specialised action models for specific queries and APIs

## Context 📝
Agents require a lot of information, including **tool documentation, outputs from previous steps, and reasoning**. Models good at planning aren't necessarily good with long contexts

![2025-02-24 at 09.45.00@2x.png](/images/2025-02-24-at-09.45.00-at-2x.png)

![2025-02-24 at 09.44.54@2x.png](/images/2025-02-24-at-09.44.54-at-2x.png)

![2025-02-24 at 09.52.20.png](/images/2025-02-24-at-09.52.20.png)

![2025-02-24 at 09.53.06.png](/images/2025-02-24-at-09.53.06.png)

![2025-02-24 at 09.54.09.png](/images/2025-02-24-at-09.54.09.png)

- Use short-term memory (context) for immediate task-relevant information.
- Supplement with long-term memory (external databases or storage) for less immediate information.
- Incorporate essential information into the model's internal knowledge through fine-tuning11.

---

> I recently started reading [AI Engineer](https://www.amazon.com/dp/1098166302?&linkCode=sl1&tag=chiphuyen-20&linkId=0a4e5ad4b14080d44c42640550a9291e&language=en_US&ref_=as_li_ss_tl) book by Chip Huyen and it's pretty good so far. I highly recommend you to check that out, if you plan on getting into AI domain and build a better foundation 🙌

Happy Building Agents!