# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Hugo static site blog called "AI Engineer Guide" that focuses on AI engineering content. The site uses:
- **Hugo** static site generator with `hugo-bearblog` theme
- **Netlify** for hosting and serverless functions
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
- Netlify config in `netlify.toml` with build settings and redirects

### Netlify Functions
- **404 Tracking**: `netlify/functions/track-404.mjs` sends push notifications via Pushover when users hit 404 pages
- **Environment Variables**: Requires `PUSHOVER_API_TOKEN` and `PUSHOVER_USER_KEY`

## Content Organization

Blog posts are organized by year/month in `content/blog/YYYY-MM/` format. Each post includes:
- Hugo front matter with title, date, tags
- Markdown content with image references
- Automatic tag-based categorization

## Deployment

- **Build Command**: `hugo --gc --minify --config hugo.toml`
- **Publish Directory**: `public/`
- **Hugo Version**: 0.140.0 (specified in netlify.toml)
- **Timezone**: Asia/Kolkata

## Custom Features

- RSS feed customization via `layouts/rss.xml`
- Custom 404 page with tracking integration
- Umami analytics integration
- Cloudinary-based OG image generation