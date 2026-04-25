---
title: "SEO Audit & AI Discoverability Overhaul"
type: feat
status: active
date: 2026-04-24
deepened: 2026-04-24
---

# SEO Audit & AI Discoverability Overhaul

## Enhancement Summary

**Deepened on:** 2026-04-24
**Sections enhanced:** 8
**Research agents used:** architecture-strategist, performance-oracle, pattern-recognition-specialist, security-sentinel, best-practices-researcher (x2)

### Critical Issues Found During Deepening

| # | Severity | Issue | Original Plan | Correction |
|---|----------|-------|---------------|------------|
| 1 | **CRITICAL** | `{{ partial "opengraph.html" }}` silently fails — Hugo internal templates use `{{ template }}` not `{{ partial }}` | Proposed switching to `partial` syntax | **Keep `{{ template "_internal/..." }}`** — they are NOT deprecated |
| 2 | **CRITICAL** | Phase 1 references `jsonld.html` before Phase 2 creates it — will break build | Phases 1+2 separate | Create empty stub in Phase 1, fill in Phase 2 |
| 3 | **CRITICAL** | `/static/*` in `_headers` matches nothing — Netlify serves static files at root path | Had `/static/*` path | Use `/images/*` and `/*` patterns |
| 4 | **CRITICAL** | `/*.html` in `_headers` doesn't match Hugo clean URLs | Had `/*.html` path | Use `/*` catch-all for HTML pages |
| 5 | **HIGH** | `description: null` is a truthy string in Hugo — produces literal "null" in meta tags | Phase 3 | **Handle in template** — filter out string "null" in seo_tags.html |
| 6 | **HIGH** | Missing HSTS security header | Not in plan | Added to `_headers` |
| 7 | **HIGH** | `enableGitInfo` not configured — `dateModified` equals `datePublished` | Mentioned but not added | Added to Phase 2 hugo.toml changes |
| 8 | **HIGH** | JSON-LD URL values need `jsonify` — Hugo HTML-escapes template output in `<script>` tags | Mixed escaping | All dynamic values use `jsonify` |
| 9 | **MEDIUM** | BreadcrumbList in acceptance criteria but missing from template code | Only BlogPosting + WebSite | BreadcrumbList template added |
| 10 | **MEDIUM** | WebSite SearchAction schema is **deprecated** (Google removed sitelinks Nov 2024) | Included WebSite schema | Keep WebSite schema but **remove SearchAction** |
| 11 | **MEDIUM** | Referrer-Policy conflict between `_headers` and `<meta>` tag in baseof.html | Not addressed | Remove meta tag from baseof.html |
| 12 | **MEDIUM** | Bytespider (ByteDance) controversial — consider blocking | Allowed | Block by default, document opt-in |

### Key Improvements

1. **Phase dependency fix** — No more broken builds between phases
2. **Correct `_headers` paths** — Headers will actually apply to content
3. **HSTS + security headers** — Proper HTTPS enforcement
4. **Consistent JSON-LD escaping** — Valid structured data on all pages
5. **articleBody in JSON-LD** — Full content exposure for AI agents (highest-impact AI discoverability)
6. **AI crawler landscape** — Comprehensive 2026 crawler reference with decision framework
7. **RSS feed limit** — 50 most recent posts instead of all 353 (87% size reduction)

---

## Overview

Comprehensive SEO audit and implementation for AIEngineerGuide.com following a ~40% traffic drop caused by missing canonical tags during the `/blog/` → `/til/` URL migration (see postmortem: `docs/2026-04-21-traffic-drop-postmortem.md`). This plan addresses all remaining SEO gaps, adds AI agent discoverability (llms.txt), hardens the site infrastructure, and sets up monitoring to prevent future traffic drops.

## Problem Statement / Motivation

The March 2026 URL migration exposed critical SEO weaknesses: no canonical tags, incomplete redirects, broken RSS. While fixes were applied (canonical tags, wildcard redirect, RSS fix), the audit revealed **18+ additional SEO issues** across technical SEO, structured data, content quality, and infrastructure. The site also lacks AI discoverability — no llms.txt, no AI crawler support in robots.txt, no structured content for AI agents.

**Active harm still occurring:** The `/blog → /til` root redirect is still a **302 (temporary)** instead of 301 (permanent), meaning Google is NOT transferring link equity for the blog index page — a likely contributor to the ongoing traffic deficit.

**Silent meta description bug:** 98 posts have `description: null` in front matter (managed in external CMS). Hugo's `with` directive treats the string `"null"` as truthy, producing the **literal text "null"** as the meta description. This will be handled at the template level by filtering out the string "null".

## Proposed Solution

Six-phase implementation covering emergency fixes, technical SEO foundation, structured data, content quality, AI discoverability, and monitoring.

## Technical Considerations

### Current SEO-Critical File Map

| File | Purpose | Status |
|------|---------|--------|
| `hugo.toml` | Site config | Placeholder description, outdated copyright, duplicate ogImage config |
| `layouts/_default/baseof.html` | Base HTML template | Title tag missing site name suffix; conflicting referrer meta tag |
| `layouts/partials/seo_tags.html` | Canonical + meta + OG | Non-standard `<meta name="title">`, useless `<meta name="keywords">` |
| `themes/hugo-bearblog/layouts/robots.txt` | robots.txt template | Minimal — no Disallow, no AI crawler sections |
| `static/_redirects` | Netlify redirects | 468 lines; `/blog → /til` root is 302 not 301 |
| `static/_headers` | Netlify headers | **MISSING** — no caching or security headers |
| `layouts/rss.xml` | RSS feed | Full HTML content for all 353 posts (~1.7-2.0 MB feed) |
| `netlify.toml` | Build config | No `[[headers]]` section; shallow git clone breaks `enableGitInfo` |

### Key Architectural Decisions

- **Keep `{{ template "_internal/..." }}` syntax** — Hugo's internal templates (opengraph, twitter_cards) are accessed via `template`, not `partial`. The `partial` function only finds user-defined partials. The `template` syntax is NOT deprecated.
- **Remove Hugo `_internal/schema.html` microdata** when adding JSON-LD to avoid duplicate schema warnings in GSC
- **Use `static/_headers`** (not `netlify.toml [[headers]]`) to keep headers alongside `_redirects`
- **llms.txt as static file** (not Hugo-generated) for simplicity; manually updated with content changes
- **Meta descriptions**: Template-level handling for `description: null` (content managed in external CMS)
- **Tag pages**: Keep indexed but add `noindex` for thin tag pages (< 3 posts) and paginated pages
- **Block Bytespider** — Controversial ByteDance crawler with aggressive crawl rates, no reciprocal traffic value for English-language sites
- **Use front matter `lastmod`** instead of `enableGitInfo` to avoid build time increase and Netlify shallow clone issues
- **Limit RSS to 50 posts** — Reduces feed from ~2 MB to ~50 KB (85-87% reduction)

### Performance Impact Assessment

| Change | Page Weight Impact | CWV Impact | Build Time Impact |
|--------|-------------------|------------|-------------------|
| Add JSON-LD | +0.7 KB/page (+6%) | None (non-blocking) | Negligible |
| Remove microdata schema | -0.2-0.5 KB/page | None | Negligible |
| Remove `<meta name="keywords">` | -0.1 KB/page | None | Slight improvement (removes taxonomy loop) |
| Add `_headers` caching | 0 KB | Positive (faster repeat visits) | None (static file) |
| RSS summary + 50 limit | N/A (feed only) | N/A | Slightly faster build |
| Add `llms.txt` | 0 KB | None | None |
| Keep inline CSS | 0 KB | Optimal (no render-blocking request) | N/A |

**Net page weight change:** ~+0.2-0.5 KB per page after all changes. Well within budget for a 10-12 KB base page.

**Do NOT externalize inline CSS** — At 3.5 KB total, inline CSS eliminates a render-blocking HTTP request (~50-100ms on mobile). Externalizing would worsen LCP for negligible caching benefit.

## System-Wide Impact

- **Interaction graph**: Changing `baseof.html` title template affects ALL pages. Changing `seo_tags.html` affects ALL pages' meta tags. Adding `_headers` affects ALL HTTP responses.
- **Error propagation**: JSON-LD syntax errors in the partial will appear on every page. Must validate with Google Rich Results Test before deploy.
- **State lifecycle risks**: Changing redirect status codes (302→301) is irreversible in Google's index. Once Google consolidates `/blog` signals to `/til`, reverting would cause another traffic drop.
- **API surface parity**: `static/_redirects` serves dual purposes — SEO redirects AND API proxy routes (`/api/search`, `/api/related`). Changes must not break API routing.
- **Header/redirect interaction**: Netlify processes `_redirects` BEFORE `_headers`. Redirects apply first, then headers apply to the final response. No conflict between the two files.

## Acceptance Criteria

### Phase 0: Emergency Fixes (Deploy Immediately)

- [ ] Site description updated from `"Hugo + Bear = :heart:"` to meaningful description in `hugo.toml:29`
- [ ] Copyright year updated from `2024` to `2024-2026` in `hugo.toml:11`
- [ ] Duplicate `[ogImage]` block removed from `hugo.toml:51-54` (keep `[Params.ogImage]` at lines 78-81)
- [ ] Legacy `blog = "/blog/:slug/"` permalink rule removed from `hugo.toml:23`

### Phase 1: Technical SEO Foundation

- [ ] Title tag format updated to `"Page Title | AI Engineer Guide"` in `layouts/_default/baseof.html:9`
- [ ] Conflicting referrer meta tag removed from `layouts/_default/baseof.html:12` (HTTP header in `_headers` takes over)
- [ ] `static/_headers` created with correct Netlify paths, caching rules, security headers (including HSTS), and content-type headers
- [ ] `layouts/robots.txt` created (override theme) with AI crawler Allow directives, Bytespider blocked, `/api/` Disallowed
- [ ] RSS feed switched from full HTML to summaries, limited to 50 most recent posts in `layouts/rss.xml:20`
- [ ] `hugo.toml` `[sitemap]` section added with changefreq and priority defaults
- [ ] `seo_tags.html` description meta handles `description: null` gracefully (filters out literal "null" string, falls back to `.Summary`)
- [ ] Non-standard `<meta name="title">` removed from `seo_tags.html:4`
- [ ] Useless `<meta name="keywords">` removed from `seo_tags.html:6`
- [ ] `_internal/schema.html` microdata removed from `seo_tags.html` (happens here, not Phase 2)
- [ ] 404 page gets `<meta name="robots" content="noindex">` via conditional in `seo_tags.html`
- [ ] Empty `layouts/partials/json-ld.html` stub created (filled in Phase 2)
- [ ] `{{ partial "json-ld.html" . }}` call added to `seo_tags.html`

### Phase 2: Structured Data

- [ ] `layouts/partials/json-ld.html` filled with BlogPosting schema for posts, WebSite schema for homepage
- [ ] BreadcrumbList schema added to `json-ld.html` (Home > TIL > Post Title)
- [ ] All JSON-LD dynamic values use `jsonify` for consistent escaping
- [ ] JSON-LD validated with Google Rich Results Test (0 errors, 0 warnings)
- [ ] `lastmod` front matter tracking configured via `hugo.toml` frontmatter section

### Phase 3: Template Improvements

- [ ] OG image dimensions (`og:image:width`, `og:image:height`) added to `og-image.html`

> **Note:** Content changes (meta descriptions, `<!--more-->` markers, `_index.md` descriptions) are managed in the external CMS and are out of scope for this plan. Tag taxonomy thin-content noindex is handled by the `seo_tags.html` conditional added in Phase 1.

### Phase 4: AI Discoverability

- [ ] `static/llms.txt` created following llmstxt.org specification (~2-3KB concise format)
- [ ] robots.txt explicitly allows AI search crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot) and AI assistants (ChatGPT-User, Claude-User)
- [ ] Crawl-delay added for heavy crawlers (GPTBot, ClaudeBot: 10 seconds)
- [ ] llms.txt includes site summary, popular topic sections with links, RSS feed link
- [ ] AI referral tracking added to Umami analytics (track traffic from chat.openai.com, perplexity.ai, claude.ai)

### Phase 5: Monitoring & Prevention

- [ ] Google Search Console sitemap submitted
- [ ] GSC "Page with redirect" issue count tracked weekly
- [ ] Canonical tag presence verified on new posts (manual or CI check)
- [ ] Redirect chain validation script created for the 468-line `_redirects` file
- [ ] Core Web Vitals baseline established via Lighthouse
- [ ] JSON-LD structured data validated on a sample of 10 pages post-deploy

## Success Metrics

| Metric | Current | Target (8 weeks) | How to Measure |
|--------|---------|-------------------|----------------|
| Daily clicks (GSC) | ~100-200 | ~220-330 (pre-migration levels) | Google Search Console Performance |
| "Page with redirect" issues | 772 | < 50 | GSC Page Indexing report |
| Pages with valid JSON-LD | 0 | 353 | Google Rich Results Test |
| llms.txt present | No | Yes | `curl https://aiengineerguide.com/llms.txt` |
| Security headers | 0 | 6+ (incl. HSTS) | securityheaders.com |
| RSS feed size | ~1.7-2.0 MB | < 100 KB | `curl -s https://aiengineerguide.com/feed/ | wc -c` |
| "null" in meta descriptions | 98 pages | 0 pages | Template filters out "null" string |

## Dependencies & Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| JSON-LD syntax errors hurt ranking | Medium | High | Validate with Google Rich Results Test before deploy; test on staging |
| Security headers break analytics | Low | Medium | HSTS, X-Frame-Options, Permissions-Policy won't affect Umami/PostHog — these only restrict camera/mic/geo and frame embedding |
| RSS summary change annoys subscribers | Low | Low | Announce change; summaries still show enough content to evaluate |
| robots.txt blocks needed crawlers | Low | High | Test with `curl` after deploy; monitor GSC for crawl errors |

## Implementation Phases

### Phase 0: Emergency Fixes — Deploy Immediately

**Effort:** 15 minutes | **Risk:** Very Low | **Impact:** High

Files to change:

#### `static/_redirects`
```
# No change — /blog → /til intentionally stays 302 (temporary URL structure)
```

#### `hugo.toml`
```toml
# Line 11: Update copyright
copyright = "Copyright © 2024-2026, Nesin Technologies LLP."

# Line 23: Remove legacy blog permalink
# DELETE: blog = "/blog/:slug/"

# Line 29: Replace placeholder description
description = "Practical AI engineering tips, TILs, and guides covering Claude Code, MCP, AI agents, prompt engineering, and the AI tooling ecosystem. Updated daily by Ashik Nesin."

# Lines 51-54: DELETE the duplicate [ogImage] block (keep [Params.ogImage] at lines 78-81)
```

### Phase 1: Technical SEO Foundation

**Effort:** 2-3 hours | **Risk:** Low-Medium

#### `layouts/_default/baseof.html` (lines 9 and 12)
```html
<!-- Line 9: Add site name suffix -->
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{ . }} | {{ end }}{{ .Site.Title }}{{ end }}</title>

<!-- Line 12: DELETE this conflicting meta tag (Referrer-Policy now handled by _headers) -->
<!-- <meta name="referrer" content="no-referrer-when-downgrade" /> -->
```

#### `static/_headers` (new file)

> **Critical:** Netlify serves `static/` contents at root URL. `/static/*` matches nothing. Hugo generates clean URLs (no `.html` extension). Use `/*` for HTML pages.

```
# Netlify _headers
# Reference: https://docs.netlify.com/configure-builds/file-based-configuration/#headers

# Images — long cache (immutable via Cloudinary versioned URLs)
/images/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

# CSS/JS files
/*.css
  Cache-Control: public, max-age=31536000, immutable
/*.js
  Cache-Control: public, max-age=31536000, immutable

# Favicon and logo
/favicon.ico
  Cache-Control: public, max-age=604800

# Feeds
/feed/*
  Cache-Control: public, max-age=3600
  Content-Type: application/xml; charset=utf-8

# Sitemap
/sitemap.xml
  Cache-Control: public, max-age=86400
  Content-Type: application/xml; charset=utf-8

# llms.txt — AI agent discoverability
/llms.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

# Default: security headers + short cache for HTML pages
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Cache-Control: public, max-age=0, must-revalidate
```

#### `layouts/robots.txt` (new — overrides theme)

> Use Hugo's `{{ absURL }}` template function instead of hardcoding the domain, matching the theme's convention.

```txt
User-agent: *
Allow: /
Disallow: /api/

Sitemap: {{ "sitemap.xml" | absURL }}

# AI Search Crawlers (for visibility in AI-generated answers)
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# AI Assistants (for on-demand fetching when users ask about your content)
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: GPTBot
Allow: /
Crawl-delay: 10

User-agent: ClaudeBot
Allow: /
Crawl-delay: 10

# Traditional search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Blocked crawlers
User-agent: Bytespider
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
```

#### `layouts/partials/seo_tags.html`

> **Critical:** Keep `{{ template "_internal/..." }}` syntax. Hugo's internal templates (opengraph, twitter_cards) are NOT user partials — they're built-in templates accessed via `template`, not `partial`. Using `partial` silently outputs nothing.

```html
<link rel="canonical" href="{{ .Permalink }}" />

{{ if eq .Kind "404" }}
<meta name="robots" content="noindex">
{{ end }}

{{ if or (eq .Kind "taxonomy") (eq .Kind "term") }}
{{ if and (eq .Kind "term") (gt (len .Pages) 2) }}
{{ else }}
<meta name="robots" content="noindex, follow">
{{ end }}
{{ end }}

{{- $desc := "" -}}
{{- with .Description -}}
  {{- if ne . "null" -}}
    {{- $desc = . | plainify -}}
  {{- end -}}
{{- end -}}
{{- if eq $desc "" -}}
  {{- if .IsPage -}}
    {{- $desc = .Summary | plainify | truncate 160 -}}
  {{- else -}}
    {{- with .Site.Params.description -}}
      {{- $desc = . -}}
    {{- end -}}
  {{- end -}}
{{- end -}}
<meta name="description" content="{{ $desc }}" />

{{ template "_internal/opengraph.html" . }}
{{ template "_internal/twitter_cards.html" . }}

{{ partial "og-image.html" . }}
{{ partial "json-ld.html" . }}
```

#### `layouts/partials/json-ld.html` (stub — filled in Phase 2)
```html
{{/* JSON-LD structured data — implemented in Phase 2 */}}
```

#### `layouts/rss.xml` (line 13 and line 20)
```xml
<!-- Line 13: Limit to 50 most recent posts -->
{{ range first 50 (where .Site.RegularPages "Section" "til") }}

<!-- Line 20: Switch from full HTML to summary -->
<description>{{ .Summary | html }}</description>
```

#### `hugo.toml` — add sitemap config
```toml
# Place after [permalinks] section
[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5
```

### Phase 2: Structured Data

**Effort:** 1-2 hours | **Risk:** Medium

> **Note:** Google removed the Sitelinks Search Box feature in November 2024. Do NOT add WebSite schema with SearchAction — it's dead code. Keep WebSite schema without SearchAction for basic site identity.

#### `layouts/partials/json-ld.html` (fill stub from Phase 1)
```html
{{- if .IsPage -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": {{ .Permalink | jsonify }}
  },
  "headline": {{ .Title | jsonify }},
  "description": {{ with .Description }}{{ . | plainify | jsonify }}{{ else }}{{ .Summary | plainify | truncate 160 | jsonify }}{{ end }},
  "image": {{ printf "%simages/share.png" .Site.BaseURL | jsonify }},
  "datePublished": {{ .Date.Format "2006-01-02T15:04:05-07:00" | jsonify }},
  "dateModified": {{ .Lastmod.Format "2006-01-02T15:04:05-07:00" | jsonify }},
  "author": {
    "@type": "Person",
    "name": "Ashik Nesin",
    "url": {{ "https://x.com/AshikNesin" | jsonify }},
    "sameAs": [
      {{ "https://x.com/AshikNesin" | jsonify }},
      {{ "https://github.com/AshikNesin" | jsonify }}
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": {{ .Site.Params.title | jsonify }},
    "url": {{ .Site.BaseURL | jsonify }},
    "logo": {
      "@type": "ImageObject",
      "url": {{ printf "%simages/logo-icon.svg" .Site.BaseURL | jsonify }}
    }
  }
  {{ with .Params.tags }}, "keywords": {{ . | jsonify }}{{ end }}
}
</script>
{{- else if .IsHome -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": {{ .Site.Title | jsonify }},
  "url": {{ .Site.BaseURL | jsonify }},
  "description": {{ .Site.Params.description | jsonify }}
}
</script>
{{- end -}}

{{/* BreadcrumbList for all pages */ -}}
{{- if and .IsPage (ne .Section "") -}}
{{- $crumbs := slice -}}
{{- $crumbs = $crumbs | append (dict "@type" "ListItem" "position" 1 "name" "Home" "item" .Site.BaseURL) -}}
{{- with .Site.GetPage .Section -}}
{{- $crumbs = $crumbs | append (dict "@type" "ListItem" "position" 2 "name" .Title "item" .Permalink) -}}
{{- end -}}
{{- $crumbs = $crumbs | append (dict "@type" "ListItem" "position" 3 "name" $.Title) -}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": {{ $crumbs | jsonify (dict "indent" "  ") }}
}
</script>
{{- end -}}
```

#### `hugo.toml` — add frontmatter lastmod config
```toml
# Add near other frontmatter/build settings
[frontmatter]
  lastmod = ["lastmod", ":fileModTime", "date"]
```

> **Why `:fileModTime` instead of `enableGitInfo`:** `enableGitInfo` shells out to `git log` for each of the 353 posts during build, adding 10-30% build time increase. Worse, Netlify's shallow clone (~20 commits deep) produces inaccurate dates for older files. `:fileModTime` uses the file's modification timestamp from the OS — zero build cost, accurate on Netlify CI where the repo is freshly cloned.

### Phase 3: Template Improvements

**Effort:** 15 minutes | **Risk:** Very Low

> **Note:** Content changes (meta descriptions, front matter) are managed in the external CMS and are out of scope. Tag taxonomy noindex is handled by the `seo_tags.html` conditional from Phase 1.

#### `themes/hugo-bearblog/layouts/partials/og-image.html` — add dimensions
```html
<meta property="og:image" content="{{ $ogImageURL }}" />
<meta property="og:image:width" content="1600" />
<meta property="og:image:height" content="836" />
<meta name="twitter:image" content="{{ $ogImageURL }}" />
```

### Phase 4: AI Discoverability

**Effort:** 1 hour | **Risk:** Very Low

#### `static/llms.txt` (new file)

> Keep concise (~2-3KB). This is the index file — AI agents use it to discover content structure. Don't list every post; group by topic. Update when content structure changes significantly, not for every new post.

```markdown
# AI Engineer Guide

> A curated collection of today's learnings (TILs) about AI engineering — covering Claude Code, GPT-5, MCP, AI agents, prompt engineering, coding agents, and the AI tooling ecosystem. Updated daily by Ashik Nesin.

This site publishes practical, bite-sized AI engineering knowledge. Each post covers a specific tool, technique, or insight in the AI development space.

## Topics

- [Claude Code](https://aiengineerguide.com/tags/claude-code/): Tips, system prompts, plugins, and advanced usage
- [MCP (Model Context Protocol)](https://aiengineerguide.com/tags/mcp/): Server setup, testing, security, and integration
- [OpenAI](https://aiengineerguide.com/tags/openai/): GPT-5, Codex, Operator, and API updates
- [AI Agents](https://aiengineerguide.com/tags/ai-agents/): Design patterns, frameworks, and production tips
- [Coding Agents](https://aiengineerguide.com/tags/cursor/): Cursor, Gemini CLI, Droid CLI, and other AI coding tools
- [Prompt Engineering](https://aiengineerguide.com/tags/system-prompt/): System prompts, prompt leaks, and techniques

## Resources

- [All Posts (RSS Feed)](https://aiengineerguide.com/feed/): Full RSS feed of recent TIL posts
- [Sitemap](https://aiengineerguide.com/sitemap.xml): All indexed pages

## Optional

- [Twitter/X](https://x.com/AshikNesin): Follow for daily AI engineering updates
```

#### AI Referral Tracking (add to `layouts/partials/custom_body.html`)
```html
<script>
(function() {
  var aiReferrers = ['chat.openai.com','chatgpt.com','perplexity.ai','claude.ai','gemini.google.com','you.com'];
  var ref = document.referrer;
  if (ref) {
    try {
      var host = new URL(ref).hostname;
      aiReferrers.forEach(function(r) {
        if (host.includes(r) && typeof umami === 'object') {
          umami.track('ai_referral', { source: host });
        }
      });
    } catch(e) {}
  }
})();
</script>
```

#### AI Crawler Landscape Reference (2026)

For robots.txt decision-making:

| Category | Crawlers | User-Agents | robots.txt | Value |
|----------|----------|------------|------------|-------|
| **AI Search** | OAI-SearchBot, PerplexityBot, Claude-SearchBot | Indexes for AI search results | Allow | Drives traffic from AI answers |
| **AI Assistants** | ChatGPT-User, Claude-User, Perplexity-User | Fetches on-demand when users ask | Allow | Drives direct visits |
| **AI Training** | GPTBot, ClaudeBot, CCBot, Applebot-Extended | Scrapes for model training | Allow (with crawl-delay) | Future AI discoverability |
| **Controversial** | Bytespider (ByteDance) | Aggressive, mixed compliance | **Block** | No reciprocal value |
| **SEO Scrapers** | AhrefsBot, SemrushBot | SEO tool crawlers | **Block** | Wastes crawl budget |

### Phase 5: Monitoring & Prevention

**Effort:** 1-2 hours | **Risk:** Low

- Submit sitemap in Google Search Console (`https://aiengineerguide.com/sitemap.xml`)
- Request indexing for top 5 pages by clicks
- Create redirect validation script for `_redirects`
- Establish Core Web Vitals baseline with Lighthouse
- Monitor GSC "Page with redirect" issue weekly until < 50
- Validate JSON-LD on 10 sample pages with [Rich Results Test](https://search.google.com/test/rich-results)
- Verify `_headers` applied correctly: `curl -I https://aiengineerguide.com/til/some-post/` (check for HSTS, X-Frame-Options, etc.)

#### Post-Deploy Verification Commands
```bash
# Verify redirect handling
curl -sI https://aiengineerguide.com/blog | grep "HTTP\|Location"

# Verify security headers
curl -sI https://aiengineerguide.com/til/ | grep -i "strict-transport\|x-frame\|x-content-type\|referrer-policy\|permissions-policy"

# Verify llms.txt
curl -s https://aiengineerguide.com/llms.txt | head -5

# Verify RSS feed size
curl -s https://aiengineerguide.com/feed/ | wc -c
# Expected: < 100KB

# Verify no "null" in meta descriptions (template should filter it out)
curl -s https://aiengineerguide.com/til/ | grep 'meta name="description"'
# Should NOT contain literal "null"

# Verify JSON-LD
curl -s https://aiengineerguide.com/til/ | grep 'application/ld+json' | head -2

# Verify image caching headers
curl -sI https://aiengineerguide.com/images/share.png | grep -i "cache-control"
# Expected: max-age=31536000, immutable
```

## Sources & References

### Internal

- **Traffic drop postmortem:** `docs/2026-04-21-traffic-drop-postmortem.md` — Root cause analysis and fixes applied
- **SEO-critical files:** `layouts/partials/seo_tags.html`, `layouts/_default/baseof.html`, `hugo.toml`, `static/_redirects`

### External

- **llms.txt specification:** [llmstxt.org](https://llmstxt.org/) — Proposed standard for LLM-friendly site content (Jeremy Howard / Answer.AI)
- **AI crawler database:** [Known Agents](https://darkvisitors.com/agents) — Comprehensive crawler User-Agent reference
- **Google Article structured data:** [developers.google.com/search/docs/appearance/structured-data/article](https://developers.google.com/search/docs/appearance/structured-data/article)
- **Google Breadcrumb documentation:** [developers.google.com/search/docs/appearance/structured-data/breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- **Schema.org BlogPosting:** [schema.org/BlogPosting](https://schema.org/BlogPosting)
- **Hugo sitemap config:** [gohugo.io/templates/sitemap](https://gohugo.io/templates/sitemap-template/)
- **Hugo internal templates:** Hugo source at `tpl/tplimpl/embedded/templates/_partials/`
- **Netlify headers:** [docs.netlify.com/configure-builds/file-based-configuration](https://docs.netlify.com/configure-builds/file-based-configuration/#headers)
- **Google Sitelinks deprecation:** Google removed sitelinks search box November 2024 — do not implement SearchAction schema
