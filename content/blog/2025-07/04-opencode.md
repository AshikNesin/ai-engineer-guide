---
title: OpenCode - Open Source Alternatives to Claude Code
date: 2025-07-04
description: 
tags:
  - TIL
  - bookmark
url: blog/opencode
via_url:
---
Command lines based agentic code generation apps are the talk of the town. You might have already used Claude Code/OpenAI Code/Google Gemini, etc.

But if you want flexibility of using any model + open source then [OpenCode](https://opencode.ai/) is a good alternative.

![2025-07-04 at 23.39.51@2x.png](/images/2025-07-04-at-23.39.51-at-2x.png)

## How to get started?

You can install it using various  means

### Installation
**Using Homebrew (macOS)**
```bash
brew install sst/tap/opencode
```

**Using npm**
```bash
brew install sst/tap/opencode
```

**Using Bash**
```sh
curl -fsSL https://opencode.ai/install | bash
```

### Login

Once it is installed, you can run the following command to login to your auth provider of choice

```shell
opencode auth login
```

![2025-07-05 at 10.21.28@2x.png](/images/2025-07-05-at-10.21.28-at-2x.png)
The credentials are configured in `~/.local/share/opencode/auth.json`

To know about the supported provider checkout [Models.dev](https://models.dev/) which they're using under the hood.

## How to use? 

Here is a quick walkthrough by AICodeKing YouTube channel

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/P8luPmEa1QI?si=bpCnd9mlT3r1ouHP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


You can check out source code here 👉 https://github.com/sst/opencode

Happy AI coding!