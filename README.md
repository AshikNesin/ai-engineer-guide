# AI Engineer Guide
A clean, fast Hugo‑powered blog that powers [AIEngineerGuide.com](https://aiengineerguide.com)

![](https://aiengineerguide.com/preview.png)

## 🚀 Getting Started

### Prerequisites
Before you begin, make sure you have these installed:
- [Hugo](https://gohugo.io/installation/) (v0.140.0 or newer)
- [Node.js](https://nodejs.org/) (used for syncing content)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/AshikNesin/ai-engineer-guide
cd ai-engineer-guide

# Start the dev server
hugo server -t hugo-bearblog

# Or, using Makefile
make dev

# Visit http://localhost:1313 in your browser
```

## 🏗️ Site Overview
- **Live Site**: [AIEngineerGuide.com](https://aiengineerguide.com)
- **Framework**: Hugo (static site generator)
- **Theme**: `hugo-bearblog` 
- **Hosting**: Cloudflare Pages + Pages Functions
- **Content Source**: Obsidian vault
- **Analytics**: Umami integration (self hosted)
- **Timezone**: Asia/Kolkata

## 📝 Content Management

### How It Works

### Content Pipeline
- Source notes live in `~/Sync/Notes/ai-notes/AIEngineerGuide/content/blog/`
- Synced via: `scripts/sync-obsidian-notes.js`
- Output: `content/blog/` in Hugo format
- Images: Automatically copied to `static/images/`

Content is maintained in a separate [repo](https://github.com/AshikNesin/ai-notes/tree/main/AIEngineerGuide), synced manually when needed.

### Sync Commands

```bash
# Install sync dependencies
cd scripts && npm install

# One-time sync
cd scripts && npm run sync:once

# Watch for changes
cd scripts && npm run sync:watch
```

### Structure
Posts are grouped by year/month: `content/blog/YYYY-MM/`

Each post includes:
- Hugo front matter (title, date, tags)
- Markdown content + image links
- Tags

## 🛠️ Useful Commands

```bash
# Start local development server
hugo server -t hugo-bearblog

# Production build
hugo --gc --minify --config hugo.toml

# Clean up build files
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
├── functions/         # Cloudflare Pages Functions (API proxy, 404 tracking)
├── hugo.toml          # Primary Hugo configuration
├── static/
│   ├── _redirects     # Cloudflare Pages redirects
│   └── _headers       # Cache/security headers
└── Makefile
```

## 🚀 Deploying to Cloudflare Pages

### Settings

* **Build Command**: `hugo --gc --minify --config hugo.toml`
* **Publish Directory**: `public/`
* **Hugo Version**: `0.140.0` (set in Cloudflare Pages build environment)
* Redirects & headers live in `static/_redirects` and `static/_headers`

### Environment Variables

Used by `functions/api/track-404.js` for 404 tracking:

* `PUSHOVER_API_TOKEN`
* `PUSHOVER_USER_KEY`

---

## ✨ Key Features

* **Obsidian Sync**: Write in Obsidian, publish with Hugo
* **404 Notifications**: Real‑time alerts via Pushover
* **RSS Feed**: Custom RSS generation
* **Analytics**: Privacy‑first insights with Umami
* **OG Images**: Social previews via Cloudinary
* **Responsive Design**: Mobile‑friendly, clean typography

---

## 🔧 Customization

### Layouts

Override theme templates via `layouts/`:

* `layouts/_default/baseof.html`
* `layouts/partials/`
* `layouts/shortcodes/`

### Pages Functions

Custom Cloudflare Pages functions:

* `functions/api/track-404.js` — sends push alerts for broken links
* `functions/api/[[path]].js` — proxies `/api/search` and `/api/related` to qblog.nesin.io

---

## 📊 Monitoring

* **Umami**: Lightweight, privacy‑friendly analytics
* **404 Alerts**: Instant detection of broken links
* **Build Logs**: Cloudflare Pages deployment feedback (`make build-progress`)


---

## 📄 License
MIT

## 🔗 Links

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Bearblog Theme](https://github.com/janraasch/hugo-bearblog)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
