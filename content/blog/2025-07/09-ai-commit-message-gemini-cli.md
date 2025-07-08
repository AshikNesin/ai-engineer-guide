---
title: Auto-Generate AI Commit Message using Gemini CLI
date: 2025-07-09
description: 
tags:
  - gemini-cli
url: blog/ai-commit-message-gemini-cli
via_url:
---
When working on side projects or writing a blog post, I don't want to go to IDE and then use AI generated commit message feature. Instead I prefer doing it via CLI itself by running a single command.

Let's see how I do it using [gemini-cli](https://aiengineerguide.com/blog/google-gemini-cli/) in the background.

## Generating the commit message

```shell
git diff | gemini --prompt "Generate a concise commit message:"
```

What we're doing here is:
1. `git diff`: It outputs the changes you've made that are not yet staged for commit.
2. Piping to `gemini`: The output from git diff is piped into the gemini command.
3. **`gemini --prompt "Generate a concise commit message:"`**: It invokes the Gemini CLI sending the provided prompt along with the piped input (your git diff)

Note: You can pass `--model`  arg in gemini cli to change the model to something like `gemini-2.5-flash` as well

## Aborting in case of empty message
```shell
commit_msg=$(git diff | gemini --prompt "Generate a concise commit message:")
if [ -z "$commit_msg" ]; then
  echo "Commit message is empty. Aborting commit."
  exit 1
fi
git commit -am "$commit_msg"
```

## Complete Snippet
```shell
#!/bin/bash

# Stage all changes
git add .

# List staged files
added_files=$(git diff --cached --name-only)
if [ -z "$added_files" ]; then
  echo "⚠️ No changes to commit. Aborting."
  exit 1
fi

echo "📄 Files staged for commit:"
echo "$added_files"

# Generate commit message using Gemini
commit_msg=$(git diff --cached | gemini --model gemini-2.5-flash --prompt "Generate a concise commit message:")

# Check if commit message is empty
if [ -z "$commit_msg" ]; then
  echo "❌ Commit message is empty. Aborting commit."
  exit 1
fi

# Commit with the generated message
git commit -m "$commit_msg"
```

Happy auto committing!