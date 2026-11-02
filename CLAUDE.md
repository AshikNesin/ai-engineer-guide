# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Hugo static site blog called "AI Engineer Guide" that focuses on AI engineering content. The site uses:
- **Hugo** static site generator with `hugo-bearblog` theme
- **Cloudflare Pages** for hosting and Pages Functions
- **Obsidian** for content creation with sync automation
- **Umami** for analytics

## Key Commands

### Development
```bash
# Start local development server
hugo server -t hugo-bearblog

# Build for production
hugo --gc --minify --config hugo.toml
```

### Content Management
```bash
# Sync content from Obsidian (one-time)
cd scripts && npm run sync:once

# Watch for changes and auto-sync
cd scripts && npm run sync:watch
```

## Project Structure

### Content Pipeline
- **Source**: Obsidian vault at `~/Sync/Notes/ai-notes/AIEngineerGuide/content/blog/`
- **Sync Script**: `scripts/sync-obsidian-notes.js` handles automated content synchronization
- **Destination**: `content/blog/` directory in Hugo format
- **Images**: Automatically synced from Obsidian attachments to `static/images/`

### Site Configuration
- Primary config: `hugo.toml` (overrides `config.toml`)
- Theme: `hugo-bearblog` located in `themes/` directory
- Custom layouts in `layouts/` override theme defaults
- Cloudflare Pages redirects in `static/_redirects`, headers in `static/_headers`

### Cloudflare Pages Functions
- **404 Tracking**: `functions/api/track-404.js` sends push notifications via Pushover when users hit 404 pages
- **API Proxy**: `functions/api/[[path]].js` proxies `/api/search` and `/api/related` to qblog.nesin.io
- **Environment Variables**: Requires `PUSHOVER_API_TOKEN` and `PUSHOVER_USER_KEY`

## Tools section (`/tools/`)

- Free, browser-only tools. No backend, no Pages Functions for tools, no Node step in the Cloudflare build.
- Live tools: model retirement calendar (+ provider and per-model pages, `.ics`, RSS), request migration linter (+ one error page per rule), deprecated model-ID scanner, LLM API cost calculator (tabs: monthly cost, token count, context fit, prompt caching, old → new model; `/tools/token-counter/` pages reuse it), structured output schema checker + tool converter.
- Pages: `content/tools/`. Generated pages come from content adapters: `content/tools/model-retirements/_content.gotmpl` and `content/tools/model-migration-linter/_content.gotmpl` (errors). Slugs never change; add a 301 in `static/_redirects` if one must.
- Layouts: `layouts/tools/` (single dispatches retirement, error and tool pages), `layouts/retirements/` (calendar + `.ics` + RSS), partials in `layouts/partials/tools/` (tool UIs in `ui/`).
- JS: one ES module per tool in `assets/js/tools/` plus `calculator/`, `linter/`, `scanner/`, `schema/` and `shared/` (not `lib/`, which is gitignored), bundled by Hugo `js.Build`. Vendored libs in `assets/vendor/` with version/source/license headers.
- Data: `data/tools.yaml` (registry), `data/models.json` and `data/retirements.json` (generated; see `scripts/tools-data/README.md`), `data/breaking_changes.json` (linter rules) and `data/schema_rules.json` (schema rules), both hand-maintained with an official source quote and checked date per rule, `data/migrations/<slug>.yaml` (hand-reviewed; `reviewed: false` shows a draft notice).
- Tests: `python -m unittest discover scripts/tools-data/tests` and `node --test assets/js/tools/tests/*.test.mjs`. Every linter rule needs a before/after example; every schema rule needs a test case.
- Tool pages support light and dark mode like the blog, and don't show related TILs.

## Content Organization

Blog posts are organized by year/month in `content/blog/YYYY-MM/` format. Each post includes:
- Hugo front matter with title, date, tags
- Markdown content with image references
- Automatic tag-based categorization

## Deployment

- **Build Command**: `hugo --gc --minify --config hugo.toml`
- **Publish Directory**: `public/`
- **Hugo Version**: 0.140.0 (set in Cloudflare Pages build environment)
- **Timezone**: Asia/Kolkata

## Custom Features

- RSS feed customization via `layouts/rss.xml`
- Custom 404 page with tracking integration
- Umami analytics integration
- Cloudinary-based OG image generation