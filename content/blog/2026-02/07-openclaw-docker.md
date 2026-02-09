---
title: How to install OpenClaw using Docker
url: blog/openclaw-docker
tags:
  - openclaw
status: published
date: 2026-02-07T00:00:00.000Z
qblog_id: 8640056c-e4aa-4d62-90d3-2c9ddd7c2301
---

If you want to try out [OpenClaw](https://openclaw.ai/) without having to worry about security and other things in your machine then using Docker based installation might be the a good choice for you.

## How to get started?

Just clone the repo

```shell
git clone https://github.com/openclaw/openclaw
```

In the root of it, you can see [./docker-setup.sh](https://github.com/openclaw/openclaw/blob/main/docker-setup.sh) file. Just run that file.

```shell
./docker-setup.sh
```

It'll do the necessary installation and other things under the hood. 

And once everything is done like configuring env variables, you should be able to access it

http://127.0.0.1:18789

You can checkout their docs on more details regarding it.

https://docs.openclaw.ai/install/docker
