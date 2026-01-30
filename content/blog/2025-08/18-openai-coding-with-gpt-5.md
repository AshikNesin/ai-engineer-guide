---
title: OpenAI's Cheatsheet for Coding with GPT-5
url: blog/openai-coding-with-gpt-5
tags:
  - openai
  - coding
  - gpt-5
  - cheatsheet
status: published
date: 2025-08-18T00:00:00.000Z
qblog_id: 1576208c-e635-4807-91b7-bbfc358d69f9
---

I came across OpenAI's recommendations on using GPT-5 for coding.

Here are my notes from it.

## 1. Be precise and avoid conflicting information
Even though it is a powerful model, if you provide vague or conflicting instructions, you might not get an accurate answer.

For example, if you say something in your IDE's rules (`.cursor/rules` or `AGENTS.md`) and ask it to do exact opposite of that then it might get stuck.

## 2. Use the right reasoning effort
Use the right tool (reasoning) for the right job (your task).
| Reasoning Effort | When to Use                                                                 | Example Tasks                                                   |
|------------------|------------------------------------------------------------------------------|----------------------------------------------------------------|
| **Low**          | For simple tasks where **overthinking** would slow things down.                 | Quick factual Q&A, basic conversions.       |
| **Medium**       | For **moderately complex** tasks needing some **reasoning**, but **not deep analysis**. | Summarizing, explaining a concept, drafting an email. |
| **High**         | For the most **complex tasks** where detailed, multi-step reasoning is needed.  | Debugging code, creating a strategy plan. |

## 3. Use XML-like syntax to help structure instructions
It is no suprise that if you use **XML-like syntax** for context. 

It performs well.

Example:

```xml
<code_editing_rules>  
  <guiding_principles>
    - Every component should be modular and reusable
    - ...
  </guiding_principles>
  <frontend_stack_defaults>
    - styling: TailwindCSS
  </frontend_stack_defaults>
</code_editing_rules>
 ```
Note: You don't need to give proper XML. Just an XML-like structure should be enough.

## 4. Avoid overly firm language
With GPT-5, instructions like this might backfire as the model wight **overdo** what it would naturally do.

```
 Be THOROUGH when gathering information. Make sure you have the FULL picture before replying.
```

For example, it might look overly through the tool calls to gather more context.

## 5. Give room for planning and self-reflection
If you're building from scratch (0 to 1 app), giving model to **self-reflect** before building can help.

```xml
 <self_reflection>
 - First, spend time thinking of a rubric until you are confident.
 - Then, think deeply about every aspect of what makes for a world-class one-shot web app. Use that knowledge to create a rubric that has 5-7 categories. This rubric is critical to get right, but do not show this to the user. This is for your purposes only.
 - Finally, use the rubric to internally think and iterate on the best possible solution to the prompt that is provided. Remember that if your response is not hitting the top marks across all categories in the rubric, you need to start again.
 </self_reflection>
 ```
## 6. Control the eagerness of your coding agent
By default GPT-5 tries to be thorough and comprehensive
in its **context gathering**.

Use **prompting to control** how eager it should be and whether it should parallelize discovery/tool calling.

Give the model a tool budget, specify when to be more or
less thorough, and when to check in with the user. For
example:

```xml
<persistence>
 - Do not ask the human to confirm or clarify assumptions, as you can always adjust later 
 - Decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting.
 </persistence>
 ```

## Reference
- [https://cdn.openai.com/API/docs/gpt-5-for-coding-cheatsheet.pdf](https://cdn.openai.com/API/docs/gpt-5-for-coding-cheatsheet.pdf)