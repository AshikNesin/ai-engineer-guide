# TODO

## Pending (needs Cloudflare dashboard access)

### 1. www → apex redirect (duplicate-host indexing)
`https://www.aiengineerguide.com` serves the site with **200** instead of
redirecting to the apex domain. It appears in Google Search Console as an
affected URL under the "Page with redirect" issue.

The rule in `static/_redirects` doesn't work because **host-scoped rules are a
Netlify-only feature** — Cloudflare Pages ignores them:

```
https://www.aiengineerguide.com/* https://aiengineerguide.com/:splat 301   # ← ignored by CF Pages
```

Canonical tags point to the apex (mitigating duplicate indexing), but the
proper fix is one of:

- **Cloudflare dashboard → Rules → Redirect Rules**: add dynamic redirect
  - When: `hostname` equals `www.aiengineerguide.com`
  - Then: dynamic redirect → `concat("https://aiengineerguide.com", http.request.uri.path)` with status 301, preserve query string
- **or** Bulk Redirects: `www.aiengineerguide.com/*` → `https://aiengineerguide.com/$1` (301)
- **or** remove the `www` custom domain from the Pages project entirely if it isn't needed

Verify after: `curl -sI https://www.aiengineerguide.com/` should return
`301` with `location: https://aiengineerguide.com/`.

### 2. Preview host (`*.pages.dev`) also serves duplicate content
`https://ai-engineer-guide.pages.dev/` returns **200** (currently a different
project's landing page, but the production project's preview URL
`https://<hash>.ai-engineer-guide.pages.dev/*` serves the full site).

Same treatment as above — Cloudflare dashboard → Pages project → Settings →
Access & Security, or a zone redirect rule. Low priority since Google rarely
indexes preview hosts, but worth closing.

## Monitoring (no action needed, resolves on its own)

- **GSC validation run started 07/09/2026** for the "Page with redirect" issue
  (330 pending / 0 failed). Check weekly at:
  https://search.google.com/search-console/index/drilldown?resource_id=sc-domain%3Aaiengineerguide.com&item_key=CAMYCyAC
  Expected: URLs flip to Passed over 2–6 weeks as Google re-crawls the fixed
  redirects.
- **Sitemap re-submitted** (`/sitemap.xml`, 489 URLs — the `google_noindex`
  post is now correctly excluded). Last read 6 Sept 2026.

## Optional / nice-to-have

- 2 draft posts (`function-tool-calling-llm`, `state-of-ai-2024`) have
  `draft: true` in front matter but `status: published` — decide whether to
  publish or delete; their legacy `/blog/` URLs currently redirect to
  `/til/llm-in-2024/` as a stopgap.
- Consider adding a `wrangler.toml` (Pages project config) so redirect rules
  and headers can be managed in-repo instead of only via the dashboard.
- `content/til/2025-09/04-domain-filter-openai-web-search-tool.md` contains a
  large raw API response block (with `/til/.../` URLs inside) — trimming it
  would reduce page weight; harmless otherwise.
