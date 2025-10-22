---
title: Anthropic Sandbox Runtime
url: blog/anthropic-sandbox-runtime
tags:
  - anthropic
  - sandbox
  - library
status: published
date: 2025-10-22T00:00:00.000Z
qblog_id: 79c12115-4eb9-4d49-9880-87f87c067a62
---

Anthropic has released a lightweight [sandbox runtime](https://github.com/anthropic-experimental/sandbox-runtime?tab=readme-ov-file) using which we can **enforce filesystem and network restrictions** without requiring complicated container.

For example, if a CLI based agent goes roughe it can read your copy your ssh key by doing a simple cat command and send it to the attacker using a simple curl request.

By sandboxing it, we give can selectively give permission for only the things that want to (both on filesystem and network connection level)

This help us to reduce the safely run AI agents in the machine.

It uses **OS sandboxing primitives** like ([sandbox-exec](https://reverse.put.as/wp-content/uploads/2011/09/Apple-Sandbox-Guide-v1.0.pdf) on macOS, [bubblewrap](https://github.com/containers/bubblewrap) on Linux) and proxy-based network filtering. 

## How to get started?
You can install this package from npm.

```shell
npm install -g @anthropic-ai/sandbox-runtime
```

Once that is done, it'll bind to `srt` command and you can run command like this

```shell
$ srt "curl example.com"
Running: curl example.com
Connection blocked by network allowlist

$ srt "cat ~/.ssh/id_rsa"
Running: cat ~/.ssh/id_rsa
cat: /Users/ashiknesin/.ssh/id_rsa: Operation not permitted  # Specific file blocked
```

![2025-10-23-at-00.57.062x.png](https://images.nesin.io/f_auto,q_auto/qblog/AIEngineerGuide/2025-10/p60xu0v9b6cvxk5zkvha)

## How to configure?
The config are loaded (and merged in the order of priority)
| Priority | Setting Type       | Description / Path                                                                 |
|-----------|--------------------|------------------------------------------------------------------------------------|
| 1         | **User settings**  | `~/.claude/settings.json`                                                          |
| 2         | **Project settings** | `$CWD/.claude/settings.json`                                                      |
| 3         | **Local settings** | `$CWD/.claude/settings.local.json`                                                 |
| 4         | **Policy settings** | Platform-specific managed settings                                                |
|           | macOS              | `/Library/Application Support/ClaudeCode/managed-settings.json`                    |
|           | Linux              | `/etc/claude-code/managed-settings.json`                                           |
| 5         | **Flag settings**  | Custom path via `--settings` flag                                                  |

Sample configuration 👇
```json
{
  "sandbox": {
    "enabled": true,
    "network": {
      "allowUnixSockets": ["/var/run/docker.sock"],
      "allowLocalBinding": false,
      "httpProxyPort": 8888,
      "socksProxyPort": 1080
    }
  },
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",
      "Edit(src/)",
      "Edit(test/)",
      "Read(.)"
    ],
    "deny": [
      "Edit(.env)",
      "Read(~/.ssh)",
      "WebFetch(domain:malicious.com)"
    ]
  }
}
```

### Permission Rules
It uses Claude Code's permission syntax

| Permission                | Description                             |
|----------------------------|-----------------------------------------|
| **WebFetch(domain:example.com)** | Allow/deny network access to a domain |
| **Edit(path)**             | Allow/deny file write access            |
| **Read(path)**             | Allow/deny file read access             |

You can refer to the docs for more fine-grained permissions

## Using Sandbox runtime as library
Once interesting thing is that we can use it as a library. So we can just use this this 👇

```js
import { SandboxManager } from '@anthropic-ai/sandbox-runtime'
import { spawn } from 'child_process'

// Initialize the sandbox (starts proxy servers, etc.)
await SandboxManager.initialize()

// Wrap a command with sandbox restrictions
const sandboxedCommand = await SandboxManager.wrapWithSandbox('curl https://example.com')

// Execute the sandboxed command
const child = spawn(sandboxedCommand, { shell: true, stdio: 'inherit' })

// Handle exit
child.on('exit', (code) => {
  console.log(`Command exited with code ${code}`)
})

// Cleanup when done (optional, happens automatically on process exit)
await SandboxManager.reset()
```

Aparently, `sandbox-exec` is depricated by Apple back in 2017 itself but tool which has similar use case like codex seems to be using it 😅

## Reference
- [Making Claude Code more secure and autonomous with sandboxing \ Anthropic](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [GitHub - anthropic-experimental/sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime)
- [sandbox-exec: macOS's Little-Known Command-Line Sandboxing Tool | Igor's Techno Club](https://igorstechnoclub.com/sandbox-exec/)

Happy sandboxing agents!