# AI Engineer Guide - Project Context

This is a Hugo-powered static site for [AIEngineerGuide.com](https://aiengineerguide.com), a blog focused on AI engineering topics.

## Project Type
This is a **static site generator project** using Hugo with a custom content pipeline that syncs from Obsidian notes.

## Project Overview

- **Framework**: Hugo (static site generator)
- **Theme**: hugo-bearblog
- **Content Source**: Obsidian vault (synced via custom script)
- **Hosting**: Netlify with serverless functions
- **Key Features**:
  - Obsidian Sync: Write in Obsidian, publish with Hugo
  - 404 Notifications: Real-time alerts via Pushover
  - RSS Feed: Custom RSS generation
  - Analytics: Privacy-first insights with Umami
  - OG Images: Social previews via Cloudinary
  - Responsive Design: Mobile-friendly, clean typography

## Project Structure

```
AIEngineerGuide/
├── content/
│   ├── blog/           # Blog posts organized by YYYY-MM
│   ├── bookmarks.md    # Bookmarks page
│   └── newsletter.md   # Newsletter page
├── layouts/            # Custom Hugo layouts
├── static/
│   ├── images/         # Blog post images
│   └── favicon files
├── themes/
│   └── hugo-bearblog/  # Theme directory
├── scripts/            # Content sync automation
├── netlify/
│   └── functions/      # Serverless functions
├── hugo.toml          # Primary Hugo configuration
└── netlify.toml       # Netlify deployment config
```

## Building and Running

### Prerequisites
- Hugo (v0.140.0 or newer)
- Node.js (used for syncing content)

### Development Commands

```bash
# Start local development server
hugo server -t hugo-bearblog

# Or, using Makefile
make dev

# Production build
hugo --gc --minify --config hugo.toml

# Clean up build files
hugo --gc
```

### Content Management

Content is maintained in a separate Obsidian vault and synced to this repository:

```bash
# Install sync dependencies
cd scripts && npm install

# One-time sync
cd scripts && npm run sync:once

# Watch for changes
cd scripts && npm run sync:watch
```

Posts are organized by year/month in `content/blog/YYYY-MM/` with:
- Hugo front matter (title, date, tags)
- Markdown content + image links
- Tags

### Publishing Workflow

```bash
# Full publish workflow: sync, autocommit, push, and monitor deployment
make publish
```

This command will:
1. Sync Obsidian notes
2. Auto-generate a commit message using Gemini
3. Commit and push changes
4. Monitor Netlify deployment progress

## Deployment

### Netlify Settings
- **Build Command**: `hugo --gc --minify --config hugo.toml`
- **Publish Directory**: `public/`
- **Hugo Version**: `0.140.0`

### Environment Variables
- `PUSHOVER_API_TOKEN` - For 404 notifications
- `PUSHOVER_USER_KEY` - For 404 notifications

## Key Components

### 1. Content Sync System
Located in `scripts/sync-obsidian-notes.js`, this Node.js script:
- Syncs content from an Obsidian vault
- Converts Obsidian markdown to Hugo-compatible format
- Automatically copies images to `static/images/`

### 2. 404 Tracking Serverless Function
Located in `netlify/functions/track-404.mjs`, this function:
- Receives 404 page hits via POST requests
- Sends real-time notifications to Pushover
- Captures client IP, location, device type, and user agent

### 3. Custom Layouts
Override theme templates via `layouts/`:
- `layouts/_default/baseof.html`
- `layouts/partials/`
- `layouts/shortcodes/`

## Development Conventions

1. **Content Organization**: Posts are grouped by year/month: `content/blog/YYYY-MM/`
2. **Front Matter**: Each post includes Hugo front matter with title, date, and tags
3. **Image Handling**: Images are automatically copied to `static/images/` during sync
4. **Customization**: Override theme templates via the `layouts/` directory
5. **Analytics**: Privacy-first analytics with Umami and PostHog

## Contribution Workflow

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Test with `hugo server`
5. Submit a pull request

## Useful Links

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Bearblog Theme](https://github.com/janraasch/hugo-bearblog)
- [Netlify Docs](https://docs.netlify.com/)