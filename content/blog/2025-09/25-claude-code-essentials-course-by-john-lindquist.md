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

### [3. Targeting the Proper Context with Claude Code](https://egghead.io/lessons/targeting-the-proper-context-with-claude-code~2i20r)
- You can use `@` in the text box to select a file or directory throught the project. And you can select a single or multiple items files.
- You can use the arrow keys to select the files you want as well. Hitting `enter` will complete the full path and adds a space.
- It supports **fuzzy searching** like for example you can do something like `@tsx` which will select all the tsx files and you can even type name of the file like `@tsxauth` which can search for `auth` with tsx file extention or even a part of a path like `@lib` 🤯
- You can even use your IDEs file selector to select file as well by using `Claude Code: Insert At-Mentioned` option (refer that video on how to do it)
![2025-09-25-at-20.41.042x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-09/svrafisgbyjmydveevjw)

And much more!

## Credits
- https://egghead.io/courses/claude-code-essentials~jc0n6 (obviously!)

Happy learning tools!