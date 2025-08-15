---
title: "TLDR: Why AI Agent is Not Just Another Buzzword by Chip Huyen"
date: 2025-02-24
description: 
tags:
  - tldr
  - talk
  - chip-huyen
url: blog/why-ai-agent-is-not-buzzword-by-chip-huyen
via_url: https://www.youtube.com/watch?v=D6v5rlqUIc8&ab_channel=AIEngineer
---
I recently watched  Chip Huyen's [talk](https://www.youtube.com/watch?v=D6v5rlqUIc8&ab_channel=AIEngineer) on challenges of building AI Agents and how to overcome them.

It's a good one, I would recommend anyone  to check that out if they've done before.

Here are some of the key insights/things that I've learned from the talk 👇

---

## What's an agent?
Anything that perceives environment and acts on the environment.

![2025-02-24 at 09.05.53@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.05.53-at-2x.png)

### Access to Tools

> Giving a model more actions expands its environment and environment determines kind of a action an Agent can perform

| Agent Type | Environment | Actions | Key Interactions |
|------------|------------|----------|-----------------|
| Chess AI | Chessboard | Move pieces | Game state analysis |
| [Coding Assistant](https://arxiv.org/pdf/2405.15793) | IDE, Files | Code generation | File system, terminal |
| Language model | Text | Processes text | Interacts with text |
| Language model (with access to image captioning model) | Text and Images | Processes text and images | Interacts with text and images |

![2025-02-24 at 09.09.55@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.09.55-at-2x.png)

### Why Use Agents?
1. **Address Model Limitations**
	- Help overcome from knowledge cutoff dates by using external tools/API like [Exa.ai](https://exa.ai)
2. **Create Multimodal Models**
	- Agents can turn text or image-only models into multimodal models by giving them access to tools that process different types of data
	- Eg: Image to caption, PDF to text, etc
3. **Workflow Integration**
	- Agents can be integrated into daily tasks by giving them access to tools like IDE, inboxes and calendars, etc

## Challenges of Building Agents 🤖
Despite the potential, building agents is challenging:

### 1. Complexity

**What is task Complexity?**
Number of steps needed to solve a task.

**The Curse of Complexity:** 😅
- Task failure rates increases as task complexity grows. 
- Many agents use multiple steps which in-turn increases the likelihood of failure.
- Not just for AI even for human tasks

![2025-02-24 at 09.16.50.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.16.50.png)

- It's kind of chicken-and-egg problem: An agent often need to perform multiple steps to accomplish a task
	- Simple tasks don't need agents
	- Simple tasks have low economic values

**Example:**

Though the question seems simple, under the hood a agent need to perform multiple steps

| **Task** | **Plan** |
| --- | --- |
| How many people bought products from company X last week? | 1. getProductList<br>2. getOrderCount<br>3. sum<br>4. generateResponse |

> "Most successful agent use-cases involve <= 5 steps" - Chip Huyen

**Prediction:** Enabling agents to handle more complexity will unlock many new use uses.

![2025-02-24 at 09.22.59.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.22.59.png)

In her benchmark, Most models can solve at most 5 steps and after 10 steps most model will fail.


And **new models** are getting better 💪

![2025-02-28 at 12.46.39.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-28-at-12.46.39.png)

![2025-02-24 at 09.26.25@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.26.25-at-2x.png)


#### [Tip] How to make Agent handle more complex tasks? 
1. Break tasks into sub tasks that agent can solve.
	- If a task requires 6 steps and agent can only plan 3 step ahead, break the task into 2 subtasks
2. Test-time compute scaling - Give model more processing power during inference (reasoning models) so that it can use more compute tokens, so it can think more. Generate more results and pick the one that is more relavent.
3. Use stronger models - Train time compute scaling

## Tool Use 🔨

**What is tool use?**
In simple terms, It's like a `Natural Language <> API translation` 

![2025-02-24 at 09.30.22@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.30.22-at-2x.png)
 
Challenges comes from both sides of the translation: 
1. Natural language is extremely ambiguous
2. On API side, we might have very bad API or very bad documentations

![2025-02-24 at 09.31.15@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.31.15-at-2x.png)

### Nuances in seemingly Simple Questions
Even a simple question "Find best selling products under $10" seems straightforward it has lot of [nuances](https://www.youtube.com/embed/D6v5rlqUIc8?si=XNU4k_mU4kd3AUS2&amp;clip=UgkxailyW_vBYRXdgSGA89TslnxU-6A7rUX8&amp;clipt=EKCpNhjn1Tk) under the hood.

![2025-02-24 at 09.32.20@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.32.20-at-2x.png)

### Documentation ✍️

> If we can't explain the functionality to the AI agent. It is going to be **really really hard** for the agent to pick the right one

Our documentation needs to be more detailed as possible. 
- What the function does
- Parameter descriptions
- Error codes
	- What causes the error?
	- What to do if you encounter it?
- Expected returned values
	- How to interpret returned values?
	- If the returned value is 1. What does it mean?

### AI's tool use !== Human's tool use

Given a task, what the human annotator does might not be optimal for AI

| **Aspect** | **Human** | **AI** |
| --- | --- | --- |
| **Interface** | GUIs | APIs |
| **Mode of Operation** | Sequential | Parallel |

### [Tip] How to make agent better at tool use?
1. Create **very good** documentation with function descriptions, parameter details, and error codes
2. Give agents narrow, well-defined functions
3. Use query rewriting and intent classifiers to resolve ambiguity
4. Instruct agent to ask for clarification when unsure
5. Build specialised action models for specific queries and APIs

## Context Management 📝
- Agents require a lots of context (**tool documentation, outputs from previous steps, and reasoning**)

![2025-02-24 at 09.44.54@2x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.44.54-at-2x.png)

- Models good at planning aren't necessarily good with long contexts

![2025-02-24 at 09.52.20.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.52.20.png)

- Memory management is crucial
	- Use short-term memory (context) for immediate task-relevant information.
	- Supplement with long-term memory (external databases or storage) for less immediate information.
	- Incorporate essential information into the model's internal knowledge through fine-tuning

![2025-02-24 at 09.53.06.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.53.06.png)

![2025-02-24 at 09.54.09.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/images/2025-02/2025-02-24-at-09.54.09.png)

---

> I recently started reading [AI Engineer](https://www.amazon.com/dp/1098166302?&linkCode=sl1&tag=chiphuyen-20&linkId=0a4e5ad4b14080d44c42640550a9291e&language=en_US&ref_=as_li_ss_tl) book by Chip Huyen and it's pretty good so far. I highly recommend you to check that out, if you plan on getting into AI Engineer and build a better foundation 🙌

Happy Building Agents!
