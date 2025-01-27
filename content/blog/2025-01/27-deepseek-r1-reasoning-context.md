---
title: How to Extract Only Reasoning Context in DeepSeek-R1
date: 2025-01-27
description: 
tags: 
url: blog/deepseek-r1-reasoning-context
---
Deepseek R1 is the talk of the town lately. It's pretty much on par with OpenAI's o1 model. 

These models are called reasoning model. It does CoT (Chain of Thoughts) under the hood.

Recently I came across a quick tip using which we can get only the the reasoning context alone. We can then pass the reasoning context to faster model like Anthropic Haiku or OpenAI 3.5 Turbo to get better result with cheaper cost.

## How to do it?
Just set `max_tokens` to `1` when making the API request. When we do this, we get only the `reasoning_content` as the result.

### Example

```sh
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DeepSeek API Key>" \
  -d '{
        "model": "deepseek-reasoner",
        "messages": [
          {"role": "user", "content": "Who are the founders of OpenAI?"}
        ],
        "stream": false,
        "max_tokens":1
      }'
```


For the above request, we'll get response like this
```json
{
  "id": "f6ffb35d-a066-465d-8df7-xxxxxxxxxxx",
  "object": "chat.completion",
  "created": 1737951118,
  "model": "deepseek-reasoner",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "",
        "reasoning_content": "Okay, so I need to find out who the founders of OpenAI are. Let me start by recalling what I know. OpenAI is a company that does a lot with artificial intelligence, like ChatGPT and other AI projects. I remember hearing some big names involved when it was started. \n\nFirst, Elon Musk comes to mind. I think he was one of the founders. He's been involved in various tech ventures, like Tesla and SpaceX, so it makes sense he might have been part of OpenAI. But I also heard he's not directly involved anymore. Maybe he stepped down at some point?\n\nThen there's Sam Altman. I know he's the CEO of OpenAI now, so he was probably a founder. Wait, wasn't he part of Y Combinator before? Yeah, he was the president there. That could be right.\n\nAnother name I've heard in connection with OpenAI is Greg Brockman. I think he's the CTO or something like that. So he might have been a co-founder as well. \n\nIlya Sutskever's name also rings a bell. He's a prominent AI researcher. I think he was involved in some major projects, like working on neural networks. Maybe he was one of the founding members?\n\nThere are probably more people. Let me think. John Schulman comes up when talking about OpenAI's research. He might be a co-founder or an early researcher. Wojciech Zaremba is another name I associate with OpenAI, maybe part of the initial team. \n\nWait, were there any others? I think the initial group had several prominent people from the tech and AI fields. Maybe someone like Reid Hoffman? He's a LinkedIn co-founder and involved in tech investments. But I'm not sure if he was a founder or just an investor. \n\nAlso, Peter Thiel's name comes up in tech circles, but again, not sure if he was a founder or investor. I think the main founders are Musk, Altman, Brockman, Sutskever, and maybe some others like Schulman and Zaremba. \n\nLet me check my memory. The founding date was around 2015, right? OpenAI was announced in December 2015. The initial announcement probably listed the founders. From what I recall, the key figures were Elon Musk, Sam Altman, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, and John Schulman. \n\nSo putting it all together, the founders are Elon Musk, Sam Altman, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, and John Schulman. There might be others, but these are the main ones I remember. Also, important to note that Elon Musk left the board in 2018 but remained a donor. Sam Altman became the CEO, and Greg Brockman is the chairman and president. \n\nWait, did Reid Hoffman or Peter Thiel contribute as investors? I think they were part of the initial donors or backers but not founders. The founders are the ones who started the organization, so probably the ones directly involved in setting it up. \n\nAnother point: OpenAI started as a non-profit before becoming a capped-profit company. The founders were instrumental in that structure. So the key people are Musk, Altman, Brockman, Sutskever, Zaremba, and Schulman. Yeah, that seems right. I think that's the list."
      },
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 696,
    "total_tokens": 708,
    "prompt_tokens_details": {
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 694
    },
    "prompt_cache_hit_tokens": 0,
    "prompt_cache_miss_tokens": 12
  },
  "system_fingerprint": "fp_xxxxxxxxxx"
}

```

You can learn more about Reasoning Model in their  [API Docs](https://api-docs.deepseek.com/guides/reasoning_model)
### Credits
- [Pietro Schirano](https://x.com/skirano/status/1881854481304047656)

Happy extracting context!