# AI Engineer Guide

A Hugo-powered static site blog focused on AI engineering content, tools, and insights. Built with modern web technologies and automated content management.

## 🚀 Quick Start

### Prerequisites
- [Hugo](https://gohugo.io/installation/) (v0.140.0+)
- [Node.js](https://nodejs.org/) (for content sync automation)
- [Git](https://git-scm.com/)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd AIEngineerGuide

# Start the development server
hugo server -t hugo-bearblog

# Visit http://localhost:1313 in your browser
```

## 🏗️ Architecture Overview

- **Framework**: Hugo static site generator
- **Theme**: `hugo-bearblog` 
- **Hosting**: Netlify with serverless functions
- **Content Source**: Obsidian vault with automated sync
- **Analytics**: Umami integration
- **Timezone**: Asia/Kolkata

## 📝 Content Management

### Content Pipeline
- **Source**: Obsidian vault at `~/Sync/Notes/ai-notes/AIEngineerGuide/content/blog/`
- **Sync Script**: Automated synchronization via `scripts/sync-obsidian-notes.js`
- **Destination**: `content/blog/` directory in Hugo format
- **Images**: Auto-synced from Obsidian attachments to `static/images/`

### Content Sync Commands

```bash
# One-time sync from Obsidian
cd scripts && npm run sync:once

# Watch for changes and auto-sync
cd scripts && npm run sync:watch

# Install sync dependencies
cd scripts && npm install
```

### Content Organization
Blog posts are organized by year/month: `content/blog/YYYY-MM/`

Each post includes:
- Hugo front matter (title, date, tags)
- Markdown content with image references
- Automatic tag-based categorization

## 🛠️ Development Commands

```bash
# Start local development server
hugo server -t hugo-bearblog

# Build for production
hugo --gc --minify --config hugo.toml

# Clean build artifacts
hugo --gc
```

## 📁 Project Structure

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

## 🚀 Deployment

### Netlify Configuration
- **Build Command**: `hugo --gc --minify --config hugo.toml`
- **Publish Directory**: `public/`
- **Hugo Version**: 0.140.0

### Environment Variables
Required for Netlify functions:
- `PUSHOVER_API_TOKEN` - For 404 tracking notifications
- `PUSHOVER_USER_KEY` - For push notification delivery

## ✨ Features

- **Automated Content Sync**: Seamless integration with Obsidian
- **404 Tracking**: Push notifications for broken links via Pushover
- **RSS Feed**: Custom RSS implementation
- **Analytics**: Umami integration for visitor tracking
- **OG Images**: Cloudinary-based social media image generation
- **Responsive Design**: Mobile-first approach with clean typography

## 🔧 Customization

### Theme Overrides
Custom layouts in `layouts/` override theme defaults:
- `layouts/_default/baseof.html` - Base template
- `layouts/partials/` - Reusable components
- `layouts/shortcodes/` - Custom shortcodes

### Netlify Functions
- **404 Tracker**: `netlify/functions/track-404.mjs`
  - Sends push notifications when users hit 404 pages
  - Helps identify broken links and content issues

## 📊 Analytics & Monitoring

- **Umami Analytics**: Privacy-focused visitor tracking
- **404 Monitoring**: Automated broken link detection
- **Build Notifications**: Netlify deployment status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `hugo server`
5. Submit a pull request

## 📄 License

This project is open source. Please check the license file for details.

## 🔗 Links

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Bearblog Theme](https://github.com/janraasch/hugo-bearblog)
- [Netlify Docs](https://docs.netlify.com/)
