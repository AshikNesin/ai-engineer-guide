---
title: How to run Claude Code on Vercel Sandbox
url: blog/claude-code-on-vercel-sandbox
tags:
  - vercel
  - sandbox
status: published
date: 2025-08-20T00:00:00.000Z
qblog_id: b7e55f0d-916d-450a-b793-e87b83c56fc1
---

Vercel has recently launched [sandbox](https://vercel.com/docs/vercel-sandbox) feature where we can **safely run untrusted or user/AI-generated code** our app with **complete isolation**

## Getting Started
You need to make sure you've installed and set up the `vercel` CLI on your machine if not.

1. **Install Vercel CLI Setup**  
   ```bash
   npm i -g vercel
   vercel login
   ```
2. **Link your project to your local repo**
You'll need to have a project to use AI sandbox even locally (since the code runs on their server)
   ```bash
   vercel link
   ```

3. **Pull the latest environment variables**  
   ```bash
   vercel env pull
   ```
   This will pull `VERCEL_OIDC_TOKEN` which is needed for Vercel sandbox.

4. **Set up ANTHROPIC_API_KEY**  
   Add your Anthropic API key to your environment variables.  
   You can add it to your `.env.local` file:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```
## Snippet

```js
import { Sandbox } from '@vercel/sandbox';

const apiKey = process.env.ANTHROPIC_API_KEY;

async function main() {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const sandbox = await Sandbox.create({
    resources: { vcpus: 4 },
    timeout: 300,
    runtime: 'node22',
  });

  await sandbox.runCommand({
    cmd: 'npm',
    args: ['install', '-g', '@anthropic-ai/claude-code'],
    stderr: process.stderr,
    stdout: process.stdout,
  });

  await sandbox.runCommand({
    cmd: 'claude',
    args: ['-p', 'hello'],
    stderr: process.stderr,
    stdout: process.stdout,
    env: {
      ANTHROPIC_API_KEY: apiKey,
    },
  });
}

await main();
```

## Running the Code
```bash
node --env-file .env.local ./index.js
```
## Credits
Based on https://x.com/RhysSullivan/status/1956826761951666387

Happy running code!