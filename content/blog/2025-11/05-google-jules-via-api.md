---
title: Google Jules via API
url: blog/google-jules-via-api
tags:
  - google-jules
  - async-agent
status: published
date: 2025-11-05T00:00:00.000Z
qblog_id: d55b831d-8b59-4fa1-95bc-8034553eedc8
---

[Google Jules](https://jules.google/) now support triggering the triggering the background/cloud agent via API. 

With that, we can automate lot of things. And unlike Cursor or other apps, you can use Google Jules for free.
![2025-11-05-at-22.30.132x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/o3bfomw8owxgnj5ifgi0)

It is powered by **Gemini 2.5 Pro**

## How to get started?
Head over to setting page and create a API key
![2025-11-05-at-22.31.572x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/lvvg22g8jog9ejreimtl)

Make sure that you've connected to your GitHub and given access to the needed repos.

### List connected repos/sources
You can find the connected repos using this API.

```shell
curl 'https://jules.googleapis.com/v1alpha/sources' \
    -H 'X-Goog-Api-Key: $YOUR_API_KEY'
```

And that will give us connected sources
```json
{
  "sources": [
    {
      "name": "sources/github/AshikNesin/404less",
      "githubRepo": {
        "owner": "AshikNesin",
        "repo": "404less",
        "isPrivate": true,
        "defaultBranch": {
          "displayName": "develop"
        },
        "branches": [
          {
            "displayName": "main"
          },
          {
            "displayName": "develop"
          }
        ]
      },
      "id": "github/AshikNesin/404less"
    }
  ]
}
```
Note: This API has pagination so make sure to handle it.

### Triggering a task
With the help of new session, you can trigger a task/job for the background agent to work on 🤖

```shell
curl 'https://jules.googleapis.com/v1alpha/sessions' \
    -X POST \
    -H "Content-Type: application/json" \
    -H 'X-Goog-Api-Key: $YOUR_API_KEY' \
    -d '{
      "prompt": "Rename frontend directory to website",
      "sourceContext": {
        "source": "sources/github/AshikNesin/404less",
        "githubRepoContext": {
          "startingBranch": "develp"
        }
      },
      "automationMode": "AUTO_CREATE_PR",
      "title": "404less website"
    }'
```
You'll be getting a response like this
```json
{
  "name": "sessions/11459899729363870000",
  "title": "404less website",
  "sourceContext": {
    "source": "sources/github/AshikNesin/404less",
    "githubRepoContext": {
      "startingBranch": "develop"
    }
  },
  "prompt": "Rename frontend directory to website",
  "url": "https://jules.google.com/session/11459899729363870000",
  "id": "11459899729363870000",
  "automationMode": "AUTO_CREATE_PR"
}
```

You can now view the progress in the dashboard
![2025-11-05-at-22.48.202x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-11/wp8c2trn3rerxuuex1sw)

## Reference
- [Changelog | Jules](https://jules.google/docs/changelog#introducing-the-jules-api)
- [Jules API  |  Google for Developers](https://developers.google.com/jules/api)

Happy async coding!