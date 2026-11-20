---
title: Matt Pocock's prompt for removing junk comments
url: til/matt-pococks-prompt-for-removing-junk-comments
tags:
  - prompt
status: published
date: 2026-11-20T00:00:00.000Z
noindex: true
qblog_id: 932ddd7c-0e8b-4862-a127-51d9bb53480a
---

Matt has recently posted this prompt that he uses to clean up the junk comments that does more harm than good in the codebase.

```
Take a look at every code comment in <my codebase | this section of the code>.

Categorise each comment as:

- Tautology: simply repeats what is already visible from the code
- Excuse: many comments allow the agent to get away with a hacky implementation, which then gets propagated through the code
- Stale: references code or implementation information that is no longer relevant
- Decision Record: documents an important, non-obvious decision about the code

For each comment, take this action:

- Tautology/Stale: delete the comment
- Excuse: delete the comment and file an issue to fix the hacky implementation
- Decision Record: move it into an ADR

Once this is done:

- Create a lint rule banning comments for <my codebase | this section of the code>
- Take a ratchet approach, assuming not all comments will be deleted this PR
- Create a /delete-comment skill in this repository so we can repeat this process later
- Estimate for me how many lines of code we'll shed by deleting all comments
```

## Reference
- https://x.com/mattpocockuk/status/2123798388227403983