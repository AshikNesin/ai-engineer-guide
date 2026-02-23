---
title: How to fetch source code for npm packages using Vercel's OpenSrc Package
url: blog/vercel-opensrc-package
tags:
  - vercel
  - opensrc
status: published
date: 2026-02-23T00:00:00.000Z
---
Vercel has recently released [opensrc](https://github.com/vercel-labs/opensrc) package using which AI agents can get context regarding a particular npm package.

The way it works is basically, it'll clone the package in the `./opensrc/` repo and add the needed prompt like this:

```markdown
<!-- opensrc:start -->

## Source Code Reference

Source code for dependencies is available in `opensrc/` for deeper understanding of implementation details.

See `opensrc/sources.json` for the list of available packages and their versions.

Use this source code when you need to understand how a package works internally, not just its types/interface.

### Fetching Additional Source Code

To fetch source code for a package or repository you need to understand, run:

```bash
npx opensrc <package>           # npm package (e.g., npx opensrc zod)
npx opensrc pypi:<package>      # Python package (e.g., npx opensrc pypi:requests)
npx opensrc crates:<package>    # Rust crate (e.g., npx opensrc crates:serde)
npx opensrc <owner>/<repo>      # GitHub repo (e.g., npx opensrc vercel/ai)
```

<!-- opensrc:end -->
```
