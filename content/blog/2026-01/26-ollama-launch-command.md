---
title: "Use Ollama in Claude Code with One Simple Command"
url: blog/ollama-launch-command
status: published
date: 2026-01-26
tags: 
- ollama
- claude-code
---
Ollama now has support for `launch` command using which you can use your local/cloud Ollama models with your AI agents like Claude Code, Codex, OpenCode, etc.

## How to get started?
Make sure that you've already pulled the models that you want to use. Make sure that you're on latest version as well (v0.15+)

```shell
ollama pull glm-4.7:cloud
```

Then run 

```shell
ollama launch
```
![2026-01-26-at-23.03.35.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2026-01/la2sr0kmigs9pzhqxwjm)

Select the tool that you want to use like Claude Code and then model you want to use with it.

It'll now start the tool with the configuration that you've choosen.

You can also start the tool directly as well.

```
ollama launch opencode
```

If you want to configure the tool that you've already configured.

```
ollama launch opencode --config
```

## Reference
https://ollama.com/blog/launch
