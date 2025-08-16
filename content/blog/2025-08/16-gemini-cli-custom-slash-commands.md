---
title: Gemini CLI Custom Slash Commands
url: blog/gemini-cli-custom-slash-commands
tags:
  - gemini-cli
  - cli-agent
status: published
date: 2025-08-16T00:00:00.000Z
qblog_id: 6685e848-523a-434b-9692-188385357799
---

Similar to that of Claude Code. Gemini CLI also supports custom slash command where you can **add your own custom prompts** to do some repetitive tasks.

You can think of it like a shortcuts for your workflow.

## How to do add it?
You can add custom commands in two places.
1. Global (`~/.gemini/commands/`)
2. Project specific (`<your-project-root>/.gemini/commands/`)

And command name is basically the file name.

For example, 
`~/.gemini/commands/test.toml` becomes `/test`
And `~/.gemini/commands/git/commit.toml` becomes `/git:commit`

Sub directories are namespaced with `:`

And in term of file it needs to be in `toml` only.

## Custom Command Format
In the `.toml` file you need to have these fields 

- `prompt` (String) - This is your custom prompt that you want the LLM to perform. Can be single-line or multi-line string.
- `description`(String) - Optional one-line description of what the command does.
 
### Arguments 
1. Shorthand injection with {{args}}
2. Default Argument Handling (arg 1, arg2, etc like in CLI apps)
3. Shell Commands with !{...}

## Example
```toml
# In: ~/.gemini/commands/git/commit.toml
# Invoked via: /git:commit

description = "Generates a Git commit message based on staged changes."

# The prompt uses !{...} to execute the command and inject its output.
prompt = """
Please generate a Conventional Commit message based on the following git diff:

```diff
!{git diff --staged}
```
"""
```
The example is based on their docs.

## Reference
- [gemini-cli/docs/cli/commands.md at main · google-gemini/gemini-cli · GitHub](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/commands.md#custom-commands)