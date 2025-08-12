---
title: Groq Code CLI - Boilerplate for building CLI Coding Agent
date: 2025-08-12
description: 
tags:
  - groq-code
  - cli-agent
url: blog/groq-code-cli
via_url:
---
CLI Agents are the talk of the town. Everyone is building and releasing one 😅

Recently, Groq has released their own CLI coding agent.

The approach that they took is they've old built the bare essentials that are needed for CLI coding agents **intentionally**

Their goal is to help people to build their own custom coding agent that solves their use case.

![2025-08-12 at 22.38.24@2x.png](/images/2025-08-12-at-22.38.24-at-2x.png)

Currently, it has support for only bare essentials like this

![2025-08-12 at 23.47.05@2x.png](/images/2025-08-12-at-23.47.05-at-2x.png)

👉 https://github.com/build-with-groq/groq-code-cli

## How to get started?

```shell
# Clone their repo
git clone https://github.com/build-with-groq/groq-code-cli
npm install
npm run build
npm link # link "groq" command to this project
```

Once you link it, you should be able to run `groq` command now.

And you can login with `/login` command in the CLI.

Happy building CLI-agent!