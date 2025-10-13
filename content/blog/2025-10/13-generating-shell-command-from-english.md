---
title: Generating Shell Command from Plain English with LLM
url: blog/generating-shell-command-from-english
tags:
  - shell
  - tools
  - groq
status: published
date: 2025-10-13T00:00:00.000Z
qblog_id: b86b5315-468b-4776-a301-1f790ed24b8e
---

LLM are really good at generating shell commands. We can leverage it to quickly convert our intent to shell command.

In this example, I'll be using `llama-3.1-8b-instant` model powered by [Groq](https://groq.com) for quick response almost instantly.

The converted command will be auto entered in the shell (it'll not execute, obsviously for safety concerns)

Here is the bash/zsh function. We'll be using jq for interacting with JSON and curl for making API request. Apart from those two packages there are no other depedencies.

Make sure that you've set `GROQ_API_KEY` env variable set in your shell.

```shell
# ai: Generate exact shell command from natural language using Groq API; no execution; globbing disabled
ai() {
  emulate -L zsh
  setopt NO_GLOB
  local query="$*"
  local system_msg="You are a command line expert. The user wants to run a command but they don't know how. Return ONLY the exact shell command needed. Do not prepend with an explanation, no markdown, no code blocks - just return the raw command you think will solve their query."

  local payload
  payload=$(jq -n --arg sys "$system_msg" --arg usr "$query" '{
    model: "llama-3.1-8b-instant",
    temperature: 0,
    max_completion_tokens: 256,
    messages: [
      { role: "system", content: $sys },
      { role: "user", content: $usr }
    ]
  }')

  local cmd
  cmd=$(curl -s "https://api.groq.com/openai/v1/chat/completions" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${GROQ_API_KEY}" \
    -d "$payload" \
    | jq -r '.choices[0].message.content' \
    | tr -d '\000-\037' \
    | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

  print -z -- "$cmd"
}

# Ensure globbing is disabled when invoking `ai`
alias ai='noglob ai'
```

## Credits
This snippet is based on https://x.com/iannuttall/status/1975615590267298006/photo/1

Happy AI-assisted workflows!