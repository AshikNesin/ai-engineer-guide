---
title: How to make Vitest faster for coding agents
url: til/vitest-since-last-run-flag
tags:
  - bookmark
status: published
date: 2026-11-28T00:00:00.000Z
qblog_id: 9e07fc63-7aec-4123-bbd4-a703b0db5d3e
---

[Vitest](https://vitest.dev) can now run the only the delta since the last run. 

```sh
vitest run --since-last-run
```

Instead of all the git diff and other magics, Vitest now remembers the last time it ran and rerun only the tests that might have been affected since then.

Basically on first run executes the full suite and on subsequent runs it checks only the modified files.

It is meant for faster feedback loop for the coding agents.

You can add something like this in your AGENTS.md file

```md
- After each change, run `vitest run --since-last-run`.
- Before finishing, run the full suite once with `vitest run`.
```

That's pretty much it. Now your agentic development got much faster.

## Reference
- https://vitest.dev/blog/vitest-5-1#run-only-affected-tests-with-since-last-run