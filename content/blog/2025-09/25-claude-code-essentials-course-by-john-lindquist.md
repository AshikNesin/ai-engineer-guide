---
title: Free Claude Code Essentials Course by John Lindquist
url: blog/claude-code-essentials-course-by-john-lindquist
tags:
  - claude-code
status: published
date: 2025-09-25T00:00:00.000Z
qblog_id: eb45a296-34cd-43ac-8124-988f5121a3c6
---

I recently came across a free Claude Code course by John Lindquist from [Egghead.io](https://egghead.io/)

![2025-09-25-at-19.37.512x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/brlllploqh5ujc3bkbm5)

Like all other course on egghead, this course is also pretty small but packed with lot of useful information which you might find interesting if you plan on using Claude Code regularly.

And this is more of like a intro course so it is helpful if you're getting started with it.

👉 [Claude Code Essentials | egghead.io](https://egghead.io/courses/claude-code-essentials~jc0n6)

## What is covered in it + my notes?
### [1. Combine Claude Code and Your Favorite IDE](https://egghead.io/lessons/combine-claude-code-and-your-favorite-ide~doycf)
Primarily it's about setting up the Claude Code Extention in VS Code (+ forks like Cursor)

And he covers things like how to configure shortcuts, how extention sets context based on the file that we're working on, etc

![2025-09-25-at-20.09.572x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/mgra2m6h8cznj0llp3vk)

### [2. The Essential Claude Code Shortcuts](https://egghead.io/lessons/the-essential-claude-code-shortcuts~dgsee)
In this video, he has covered the essential shortcuts that you should be know. 

| Feature              | Shortcut / Command | Description |
|----------------------|--------------------|-------------|
| **Resume instantly** | `claude --continue` | Reloads the previous session and context after a crash, restart, or closed editor. |
| **Rewind conversation** | Double-tap `Escape` in an empty input | Browse history and restore to an earlier point. <br> *"**Rewinding resets the chat, not your files**, you can reset it using git or explicit undo prompts for code changes."* |
| **Explicit undo/redo** | `Please undo the previous change to <file>.` | Ask Claude to revert the last change, then use shell history to re-run or tweak the prior prompt. |
| **Edit like Bash** | `Ctrl+A` / `Ctrl+E` → start/end of line <br> `Option+F` / `Option+B` → word forward/back <br> `Ctrl+W` → delete previous word <br> Double-tap `Escape` → clear input <br> `Ctrl+C` twice → hard exit | Provides Bash-like editing shortcuts. |
| **Bash mode** | Type `!` in the beginning to switch to bash mode | This helps to run bash scripts and pass that as context |

### [3. Targeting the Proper Context with Claude Code](https://egghead.io/lessons/targeting-the-proper-context-with-claude-code~2i20r)
- You can use `@` in the text box to select a file or directory throught the project. And you can select a single or multiple items files.
- You can use the arrow keys to select the files you want as well. Hitting `enter` will complete the full path and adds a space.
- It supports **fuzzy searching** like for example you can do something like `@tsx` which will select all the tsx files and you can even type name of the file like `@tsxauth` which can search for `auth` with tsx file extention or even a part of a path like `@lib` 🤯
- You can even use your IDEs file selector to select file as well by using `Claude Code: Insert At-Mentioned` option (refer that video on how to do it)
![2025-09-25-at-20.41.042x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/svrafisgbyjmydveevjw)
- You can use [repomix](https://github.com/yamadashy/repomix) CLI to combine multiple files into a single chunk and then pass it in the context

![2025-09-25-at-20.56.392x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/iw0ydx22cxbvb2rdtqbn)

### [4. Automate Tasks in Claude Code with Slash Commands](https://egghead.io/lessons/automate-tasks-in-claude-code-with-slash-commands~ylxki)
You can **custom slash command** feature to automate your day to day workflow.

Create `.claude/commands/repomix.md` (file name will be taken as command name)

```md
---
allowed-tools: Bash(repomix:*)
argument-hint: [glob pattern] [user prompt]
---

!`repomix --include "$1" --stdout --output-show-line-numbers`
```

`argument-hint` gets mapped to `$X` which you can use it in your command like in the above example (`$1`)

Then you can invoke it like this 
```
/repomix src "Summarize the codebase in TLDR format"
```
Note this commands executes and then passed the output to the LLM.

![2025-09-25-at-21.00.512x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/bn66x24t4iuianasq5vg)

This pattern abstraction the actual implementation which we don't need to remember 😅
And it is easy to share it with others.

### [5. The Cost of Context in Claude Code](https://egghead.io/lessons/the-cost-of-context-in-claude-code~rku9p)
Running `/context` gives you a rough idea on how much context is consumed before even it starts processing your actual request.

![2025-09-25-at-21.14.062x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/fwjvap8ih2v8a1tcapxk)

**What if you need more context?**
Just use bigger context model like sonnet 4 1M but be aware you'll ended up paying more (or max out the rate limit) for it though. 

### [6. Protect Secrets from Being Read by Claude Code](https://egghead.io/lessons/protect-secrets-from-being-read-by-claude-code~vd9jk)
You can use `/permission` command and then block any sensitive files like `.env`

Use arrow keys to move to **Deny** tab

![2025-09-25-at-21.25.332x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/uvjrurqyvsuf5d9x60vc)

And then add the rule, in this case we're blocking read access for `.env` file in current directory

![2025-09-25-at-21.26.212x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/cmjpr4txcefnfngg5ssc)

Depending on your requirement, you can store it local/project/user setting level.
![2025-09-25-at-21.34.532x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/bksliq3xcq0j3snveqqa)

For example, you can also block read access to `~/.ssh`or other files so that any rouge will not have access to it.

Make sure to add `.claude/settings.local.json` in `.gitignore`

### [7. Organizing Personal and Project Settings in Claude Code](https://egghead.io/lessons/organizing-personal-and-project-settings-in-claude-code~q7qsw)
You can use `/add-dir` to add additional docs and can add it only for that particular session and whenever we're on that directory.

That config gets added to `.claude/settings.local.json`.

![2025-09-25-at-21.41.292x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/vdkfeul60np8aw0sn13v)

If you want to share the settings with everyone then add it in `.claude/settings.json` and share it.

Note: Property defined in local level does not override the project level settings. It's more like both the settings will be applied. 

## Credits
- https://egghead.io/courses/claude-code-essentials~jc0n6 (obviously!)

Happy learning tools!