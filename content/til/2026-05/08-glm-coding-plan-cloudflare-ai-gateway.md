---
title: How to use GLM Coding Plan in Cloudflare AI Gateway
url: til/glm-coding-plan-cloudflare-ai-gateway
tags:
  - cloudflare
  - glm-coding-plan
status: published
date: 2026-05-08T00:00:00.000Z
qblog_id: 522c6684-2f9e-4390-a6f7-763d3fbafc00
---

Cloudflare provides us a **centralized** control for our AI applications. You can connect multiple AI providers like OpenAI, Anthropic, Google Gemini, Groq, AWS Bedrock, etc

And you get a universal API endpoint as well. So that you don't have to worry about installing multiple SDKs and things to use multiple AI providers.

You can also add your own custom provider as well.

![2026-05-08-at-20.53.39.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/tezoq5hc2p72lezfwo3n)

In this post, let see how to use GLM Coding Plan API with it.

![2026-05-08-at-21.00.23.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/uyjxhzkc5xjvskms0ewn)

Just create a new **custom provider**

| Parameter      | Value                     |
|----------------|---------------------------|
| Base URL       | `https://api.z.ai`        |
| Provider Slug  | `zai-coding-plan` (replace with any name you prefer) |

And you can configure the API key in **Store your LLM Keys**. Your custom provider will show up there.

![2026-05-08-at-21.03.04.png](https://cdn.qblog.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-05/ok8kxb3fegs57chctnee)

Once that is configured, we can make LLM calls like this

```shell
curl --location 'https://gateway.ai.cloudflare.com/v1/:cloudflare_account_id/example-project/custom-zai-coding-plan/api/coding/paas/v4/chat/completions' \
--header 'cf-aig-authorization: Bearer $CF_AI_GATEWAY_API_KEY' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-5",
    "messages": [
      {
        "role": "user",
        "content": "Why sky is blue?"
      }
    ]
  }'
```

<details>
  <summary>Click to expand response</summary>

```json
{
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "The short answer is that the sky is blue because of how sunlight interacts with Earth's atmosphere. This process is called **Rayleigh scattering**.\n\nHere is a step-by-step breakdown of how it works:\n\n**1. Sunlight contains all colors**\nThe light coming from the sun looks white to us, but it is actually made up of all the colors of the rainbow (red, orange, yellow, green, blue, indigo, and violet). Light travels in waves, and each color has a different wavelength. \n*   **Red light** has long, lazy waves.\n*   **Blue light** has short, choppy waves.\n\n**2. The atmosphere acts as an obstacle**\nEarth's atmosphere is filled with gases (mostly nitrogen and oxygen) and microscopic particles. \n\n**3. The \"Scattering\" Effect**\nWhen sunlight reaches Earth's atmosphere, the gases and particles bounce the light around in all directions. However, they don't bounce all colors equally. \nBecause blue light has shorter, smaller waves, it collides with the gas molecules much more frequently than red light does. These collisions scatter the blue light in every direction. Since the blue light is scattered everywhere, no matter which direction you look in the sky, you see that scattered blue light.\n\n***\n\n### Two common follow-up questions:\n\n**Why isn't the sky violet?**\nViolet light actually has an even shorter wavelength than blue light, so it gets scattered even more! However, the sky doesn't look violet for two reasons:\n1. The sun emits much less violet light than blue light to begin with.\n2. Human eyes are naturally much more sensitive to blue light than to violet light. Our brains simply interpret the mixture of colors in the sky as blue.\n\n**Why are sunsets red and orange?**\nWhen the sun is high in the sky, the light only has to travel through a thin layer of the atmosphere to reach your eyes. But at sunset, the sun is near the horizon, and the light has to travel through *much more* of the atmosphere to reach you. By the time the light makes that long journey, almost all of the blue light has been scattered away, allowing only the longer-wavelength colors—red, orange, and yellow—to reach your eyes.",
                "reasoning_content": "1.  **Deconstruct the Prompt:**\n    *   **Question:** \"Why sky is blue?\" (Simple, direct question).\n    *   **Target Audience:** General audience. Needs to be scientifically accurate but easy to understand, avoiding overly dense jargon where possible.\n\n2.  **Identify Key Scientific Concepts:**\n    *   Sunlight (white light) contains all colors of the rainbow.\n    *   Earth's atmosphere is made of gases (nitrogen, oxygen) and particles.\n    *   Light travels in waves.\n    *   Different colors of light have different wavelengths (Red = long, Blue = short).\n    *   *Rayleigh scattering* (the core mechanism).\n    *   Human eye biology (rods/cones, sensitivity to blue).\n\n3.  **Structure the Explanation:**\n    *   **The Short Answer (TL;DR):** Give a quick, one-sentence summary for immediate satisfaction.\n    *   **Step-by-Step Breakdown:**\n        *   *Step 1: The Nature of Sunlight:* Explain that light is made of colors.\n        *   *Step 2: The Atmosphere's Role:* Describe what light hits.\n        *   *Step 3: The Scattering Effect (Rayleigh Scattering):* Explain *why* blue scatters more (wavelength differences).\n        *   *Step 4: Human Eyes:* Briefly mention why we perceive it as blue (violet scatters more, but our eyes are more sensitive to blue).\n    *   **Bonus/Related Concept (Optional but helpful):** Why are sunsets red? (Shows the flip side of the same coin).\n\n4.  **Drafting the Content - Section by Section:**\n\n    *   *Intro:* Start strong. The sky is blue because of how sunlight interacts with our atmosphere. This phenomenon is called *Rayleigh scattering*.\n\n    *   *Step 1: Sunlight has all colors.* Mention a prism or a rainbow. White light isn't just white; it's red, orange, yellow, green, blue, indigo, violet.\n\n    *   *Step 2: Light travels in waves.* Crucial point. Red waves are long and lazy. Blue/violet waves are short and choppy.\n\n    *   *Step 3: The Collision (Scattering).* When sunlight hits the atmosphere (gas molecules like oxygen and nitrogen), the long waves (red) pass right through. The short waves (blue) crash into the molecules and scatter in every direction. Since blue is scattered everywhere, no matter which way we look in the sky, we see that scattered blue light.\n\n    *   *Step 4: The Violet Mystery (A great nuance).* Wait, violet is even shorter than blue. Why isn't the sky violet?\n        *   Reason 1: Sunlight puts out less violet than blue.\n        *   Reason 2: Our eyes are much more sensitive to blue light.\n\n    *   *Extra: Sunsets.* As a bonus, explain that at sunset, light travels through *more* atmosphere. All the blue gets scattered away, leaving only the reds and oranges to reach our eyes.\n\n5.  **Review and Refine:**\n    *   *Tone Check:* Is it friendly and accessible? Yes.\n    *   *Clarity:* Are the analogies working? (Using waves/crashing is a good mental image).\n    *   *Formatting:* Use bolding, bullet points, and numbered lists to make it easy to scan and read.\n\n6.  **Final Polish (similar to the generated output):**\n    *   \"The short answer is...\" -> Great hook.\n    *   Break into three distinct steps: Sunlight, The Atmosphere, and Scattering.\n    *   Add the \"Why not violet?\" FAQ because it naturally follows the logic.\n    *   Add the sunset fact for completeness.\n\n7.  *(Self-Correction during drafting):* I initially just thought of saying \"blue scatters.\" I need to make sure I specify *Rayleigh scattering* so the science is exact, but define it simply as \"light bouncing off gas molecules.\"\n\n8.  **Output Generation:** (This matches the provided good response.)",
                "role": "assistant"
            }
        }
    ],
    "created": 1778254718,
    "id": "20260508233808a6b4f9a994f2422a",
    "model": "glm-5.1",
    "object": "chat.completion",
    "request_id": "20260508233808a6b4f9a994f2422a",
    "usage": {
        "completion_tokens": 1335,
        "completion_tokens_details": {
            "reasoning_tokens": 874
        },
        "prompt_tokens": 10,
        "prompt_tokens_details": {
            "cached_tokens": 0
        },
        "total_tokens": 1345
    }
}
```

</details>


