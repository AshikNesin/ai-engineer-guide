---
title: How to use GLM-5 for free with Modal
url: blog/free-glm-5-modal
tags:
  - modal
  - glm-5
status: published
date: 2026-02-14T00:00:00.000Z
qblog_id: 4356c7ff-2fdb-42a6-b930-346d09066ae2
---

You can use `GLM-5` model for free with [Modal.com](https://modal.com) until **April 30th, 2026**

Just head over to: https://modal.com/glm-5-endpoint and get your API key by logging into your Modal account (even free account is enough)

![2026-02-13-at-21.27.28.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/z4jm0fwdmp4z4zrior5j)

Once you've the API key you can use it using this API endpoint

```shell
curl -X POST "https://api.us-west-2.modal.direct/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MODAL_RESEARCH_API_KEY" \
  -d '{
    "model": "zai-org/GLM-5-FP8",
    "messages": [
      {
        "role": "user",
        "content": "How many r-s are in strawberry?"
      }
    ],
    "max_tokens": 500
  }'
```

And you can view the requests in the web app itself as well.
![2026-02-13-at-21.32.47.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-02/hibignyfu452a5ebfsbd)

## Reference
- https://modal.com/blog/try-glm-5