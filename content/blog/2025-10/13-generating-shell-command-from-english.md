---
title: Generating Shell Command from Plain English with LLM
url: blog/generating-shell-command-from-english
tags:
  - shell
  - llm
status: published
date: 2025-10-13T00:00:00.000Z
qblog_id: b86b5315-468b-4776-a301-1f790ed24b8e
---

I came across this shell function, using which we can generate shell commands from natural language. This is really interesting one.

In the below we use droid cli, you can replace this with anything that you prefer.

```
# d: Generate exact shell command from natural language; reasoning off; no execution; globbing disabled; inserts into buffer
d() {
  emulate -L zsh
  setopt NO_GLOB
  local query="$*"
  local prompt="You are a command line expert. The user wants to run a command but they don't know how. Here is what they asked: ${query}. Return ONLY the exact shell command needed. Do not prepend with an explanation, no markdown, no code blocks - just return the raw command you think will solve their query."
  local cmd
  cmd=$(droid exec -m glm-4.6 -r off --output-format text --disabled-tools execute-cli -- "$prompt" | tr -d '\000-\037' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  print -z -- "$cmd"
}
# Ensure globbing is disabled when invoking `d`
alias d='noglob d'
```

## Reference
https://x.com/iannuttall/status/1975615590267298006/photo/1