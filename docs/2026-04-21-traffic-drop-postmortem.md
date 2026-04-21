# Traffic Drop Postmortem: /blog/ → /til/ URL Migration

**Date:** April 21, 2026
**Impact:** ~40% traffic drop (220-330 clicks/day → 60-170 clicks/day)
**Migration date:** March 1, 2026
**Recovery status:** Fixes applied, awaiting Google re-crawl (2-6 weeks)

---

## What Happened

All blog posts were migrated from `/blog/*` URLs to `/til/*` URLs on March 1, 2026. Individual 301 redirects were set up for every post in `static/_redirects`. Traffic dropped sharply afterward and stayed low for 7+ weeks.

## Root Cause

Three problems compounded:

### 1. No Canonical Tags (Primary Cause)

The site had **zero canonical tags** — neither the custom layouts nor the theme included `<link rel="canonical">`.

Without canonical tags, Google treated `/blog/slug` and `/til/slug` as **two separate pages with identical content**. Both URLs appeared in search results simultaneously:

| URL | Clicks | Impressions |
|-----|--------|-------------|
| `/blog/agentic-design-patterns-by-antonio-gulli/` | 1,950 | 29,340 |
| `/til/agentic-design-patterns-by-antonio-gulli/` | 772 | 16,000 |

GSC showed **446 `/blog/` URLs** and **405 `/til/` URLs** — same content, split ranking signals. CTR, engagement, and link equity were divided between both versions, hurting rankings for both.

### 2. No Wildcard Catch-all Redirect

298 individual post redirects existed, but no `/blog/*` → `/til/*` wildcard. Any `/blog/slug` URL not explicitly listed would **404** instead of redirecting. New posts or edge cases had no safety net.

### 3. Empty RSS Feed

`layouts/rss.xml` filtered for `Section "blog"`. Since `content/blog/` no longer existed, the main RSS feed at `/feed.xml` was **completely empty**. Any subscriber hitting `/feed.xml` got zero content.

### Google's Response

Google Search Console flagged **772 pages** as "Page with redirect" issue. The count jumped from 261 → 818 right after the migration:

| Date | Affected Pages |
|------|---------------|
| Feb 25 | 261 |
| Mar 4 | 423 |
| Mar 8 | 538 |
| Mar 11 | 692 |
| Mar 16 | 727 |
| Mar 22 | 803 |
| Mar 29 | 818 (peak) |
| Apr 17 | 772 (current) |

The "Page with redirect" flag meant Google couldn't determine canonical URLs, so it showed both versions in search results with diluted ranking signals.

## Traffic Timeline

| Period | Avg Daily Clicks | Avg Daily Impressions | Avg Position |
|--------|-----------------|----------------------|-------------|
| Feb 2026 (pre-migration) | ~220-330 | ~22,000 | ~7.3 |
| Mar 1-10 (immediate post) | ~100-170 | ~18,000 | ~7.8 |
| Mar 20-31 (continued drop) | ~60-150 | ~13,000 | ~8.2 |
| Apr 1-17 (current) | ~100-200 | ~17,000 | ~8.2 |

Key observations:
- Impressions dropped 23% — Google showing the site less
- Position dropped from 7.3 → 8.2 — slight ranking decline
- Clicks dropped ~40% — combined effect of lower impressions and position

## What Was Fixed

### Fix 1: Canonical Tags (HIGHEST IMPACT)

Created `layouts/partials/seo_tags.html` overriding the theme version. Added:

```html
<link rel="canonical" href="{{ .Permalink }}" />
```

Hugo's `.Permalink` generates `/til/slug/` URLs for all TIL content. This tells Google: "this is THE authoritative URL — consolidate all signals here."

This is separate from redirects. Redirects handle HTTP routing (user clicks old URL → lands on new URL). Canonical tags handle **index consolidation** (Google decides which URL to show in search results). Both are needed for a proper migration.

### Fix 2: Wildcard Catch-all Redirect

Added at end of `static/_redirects`:

```
/blog/* /til/:splat 301!
```

Netlify processes `_redirects` top-to-bottom, first match wins. All 298 specific redirects match first. This wildcard catches any `/blog/` URL not explicitly listed — prevents 404s on edge cases.

### Fix 3: RSS Feed Fixed

Changed `layouts/rss.xml` line 13:

```
# Before:
{{ range where .Site.RegularPages "Section" "blog" }}

# After:
{{ range where .Site.RegularPages "Section" "til" }}
```

### Fix 4: Stale config.toml Deleted

`config.toml` contained a dead redirect (`/blog/26-openai-operator-prompt` → `/blog/openai-operator-prompt` — redirecting within `/blog/`, not to `/til/`). The build uses `hugo.toml` only, so this was inert but confusing. Deleted entirely.

## Files Changed

| File | Change |
|------|--------|
| `layouts/partials/seo_tags.html` | Created — adds canonical tag, overrides theme |
| `static/_redirects` | Added wildcard catch-all at end |
| `layouts/rss.xml` | Changed `Section "blog"` → `Section "til"` |
| `config.toml` | Deleted (stale, unused) |

## Recovery Timeline

| Period | Expected Outcome |
|--------|-----------------|
| Week 1-2 | Google re-crawls pages, discovers canonical tags. "Page with redirect" count starts decreasing. |
| Week 3-4 | Google consolidates `/blog/` and `/til/` URLs. Impression count should stabilize. Clicks start recovering. |
| Week 4-6 | Most `/blog/` URLs removed from index. Traffic should return to ~80-90% of pre-migration levels. |
| Week 6-8 | Full recovery. Traffic matches or exceeds pre-migration levels. |

Recovery speed depends on crawl frequency. High-traffic pages recover faster (Google crawls them more often). Long-tail pages take longer.

## What to Monitor

### Google Search Console

1. **Page with redirect issue** — Should decrease from 772 toward zero. Check weekly.
2. **Pages report** — Filter by `/blog/` URLs. Count should decrease as Google removes them from index.
3. **Sitemap coverage** — Ensure all `/til/` URLs are indexed without issues.
4. **Click/impression trends** — Should show upward trend starting week 2-3.

### Specific checks

```
# Verify canonical tags are on pages (run on live site after deploy)
curl -s https://aiengineerguide.com/til/gemini-cli-within-claude-code/ | grep canonical

# Verify redirects work with 301 status
curl -sI https://aiengineerguide.com/blog/gemini-cli-within-claude-code/ | grep "HTTP\|Location"

# Verify wildcard catch-all works
curl -sI https://aiengineerguide.com/blog/any-random-nonexistent-slug/ | grep "HTTP\|Location"

# Verify RSS feed has content
curl -s https://aiengineerguide.com/feed.xml | grep "<title>" | head -5
```

## Lessons Learned

1. **Always add canonical tags before URL migrations.** Redirects alone aren't enough — they handle routing but not index consolidation. Without canonicals, Google treats old and new URLs as separate pages.

2. **Add wildcard catch-all redirects as safety nets.** Individual redirects are precise but fragile — one missed URL = 404. A wildcard at the end catches everything.

3. **Update all URL references when migrating.** The RSS template still filtered for "blog" section, silently producing empty feeds. Audit all templates, configs, and hardcoded URLs.

4. **Monitor GSC immediately after migration.** The "Page with redirect" issue appeared within days. Catching it early (week 1) vs late (week 7) means weeks of lost traffic.

## Post-Deploy Actions

- [ ] Submit sitemap in Google Search Console (triggers re-crawl)
- [ ] Request indexing for top 5 pages by clicks
- [ ] Check GSC "Page with redirect" issue count weekly
- [ ] Monitor clicks/impressions in GSC Performance report
- [ ] Verify canonical tags on live site with curl
- [ ] Verify wildcard redirect works for random `/blog/` URL
- [ ] Verify RSS feed returns content at `/feed.xml`
