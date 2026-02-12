---
title: How to use GLM-5 via the GLM Coding Plan API
url: blog/glm-5-coding-plan-api
tags:
  - glm-5
status: published
date: 2026-02-11T00:00:00.000Z
qblog_id: 797feb3c-94a5-463b-a3f7-adac72ff6113
---

GLM-5 is getting launched now. Even though there is no offical annoncement about API support. If we just set the model id as `glm-5` it does respond to it.

```shell
curl --location 'https://api.z.ai/api/coding/paas/v4/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Accept-Language: en-US,en' \
--header 'Authorization: Bearer $ZAI_API_KEY' \
--data '{
    "model": "glm-5",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful AI assistant."
        },
        {
            "role": "user",
            "content": "Why sky is blue?"
        }
    ],
    "stream":true
}'
```

![2026-02-11-at-21.33.552x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/lftkcw010ddqhuh4q5ai)

Note: [GLM Coding Plan](https://go.nesin.io/glm) pricing page mentions that `glm-5` is available only on Max plan (at least for now).  

![image.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/yqdljwlnxo1i9jd2jtma)