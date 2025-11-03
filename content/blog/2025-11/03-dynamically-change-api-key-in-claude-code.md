---
title: How to Dynamically Change Anthropic API Key in Claude Code
url: blog/dynamically-change-api-key-in-claude-code
tags:
  - claude-code
status: published
date: 2025-11-03T00:00:00.000Z
qblog_id: 92be154f-ff24-4ee6-b086-e00921d27bb0
---

There might cases in which you might not be able to set a static `ANTHROPIC_API_KEY` key and use Claude Code.

For example, your company might require you to rotate the key every 1 hour or you might need to load API key from some secret manager.

Claude Code has support for that using `apiKeyHelper`

## What does apiKeyHelper setting does?
When `apiKeyHelper` setting is configured, it'll run shell script and expect an API key as an output from it.

And that key will be used for `X-Api-Key` and `Authorization: Bearer` headers when making LLM request.

By default, it'll be called after 5 minutes or when we recieve HTTP 401 response.

It also means that you can change the API key **without even restarting** the Claude Code.

## How to get started?
First you'll need a shell script where you can perform some operation and then return the API key.

In our case, we'll be creating this file at `~/.claude/anthropic_key_helper.sh`

```sh
# Add your custom logic to fetch the ANTHROPIC_API_KEY
echo "sk-........."
```

Then make that file executable

```sh
chmod +x ~/.claude/anthropic_key_helper.sh
```

Now just include that file in Claude Config `~/.claude/settings.json`

```json
{
  "apiKeyHelper": "~/.claude/anthropic_key_helper.sh"
}
```

## How to customize Refresh Interval?
You can control the behaviour by setting `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` (default 5min)

For example:

```sh
# Refresh every 30 minutes
export CLAUDE_CODE_API_KEY_HELPER_TTL_MS=1800000
```

## Reference
- [Claude Code settings - Claude Docs](https://docs.claude.com/en/docs/claude-code/settings)