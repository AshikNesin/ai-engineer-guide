---
title: How to use Agentic CLI like Claude Code in Your Browser via ttyd
url: blog/agentic-cli-browser-ttyd
tags:
  - tools
  - claude-code
status: published
date: 2025-10-24T00:00:00.000Z
qblog_id: e534858c-45d7-4ef1-9109-08168db8e425
---

Today I learned about [ttyd](https://tsl0922.github.io/ttyd/) which lets you use your browser to interact with the CLI
![2025-10-24-at-23.38.342x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/m9xle54hvlrfm3pq3jo6)

I really like this approach.

I don't need to switch to different app just to use interact with my terminal.

## How to get started?
You can install ttyd on macOS using Homebrew:

```shell
brew install ttyd
```

For other OS, please refer to their [docs](https://github.com/tsl0922/ttyd?tab=readme-ov-file#install-on-linux)

Once you've installed it, you can run **ttyd** by running the following command

```sh
ttyd [options] <command> [arguments...]
```
And these are the common command arguments

| Option                         | Description                                                                         | Example                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `-W`                           | Enables **write mode** (interactive mode). Without this, the terminal is read-only. | `ttyd -W bash`                                             |
| `-p <port>`                    | Specifies the **port number** for the web server.                                   | `ttyd -p 8080 -W bash`                                     |
| `-c user:password`             | Enables **basic authentication** to restrict access.                                | `ttyd -W -c admin:secret bash`                             |
| `--readonly`                   | Forces **read-only mode**, even if `-W` is used.                                    | `ttyd --readonly bash`                                     |

For interactive sessions (write mode), use the `-W` flag.

By default, it launches in read-only mode which might be ideal for viewing logs

For example, to run Claude Code it come like this
```sh
ttyd -W claude --dangerously-skip-permissions 
```

![2025-10-24-at-23.32.322x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/xxaojmhaflssmu0k2m3b)

And now you should be able to access it your terminal and interact with it at http://localhost:7681
Except for things like not being able to upload images other things works perfectly.

If you pair it with VPN like [Tailscale](https://tailscale.com/), you can access your terminal anywhere like even in your mobile.

Happy agentic coding!