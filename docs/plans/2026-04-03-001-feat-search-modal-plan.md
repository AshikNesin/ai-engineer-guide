---
title: "feat: Add Search Modal with Keyboard Shortcut"
type: feat
status: active
date: 2026-04-03
---

# feat: Add Search Modal with Keyboard Shortcut

## Overview

Add a minimal, zero-dependency search feature to the Hugo blog. Users press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) — or click a search icon in the navbar — to open a modal with a search bar. Results from the blog search API appear below with a loading spinner. Clicking a result navigates to that page.

## Problem Frame

The blog has no way to search content. Users must browse or know the URL. A lightweight search modal backed by the existing `qblog.nesin.io` API fills this gap without adding build complexity or dependencies.

## Requirements Trace

- R1. Search trigger in the navbar (clickable element)
- R2. `Cmd+K` / `Ctrl+K` keyboard shortcut opens the modal
- R3. Minimal modal with search input and results list
- R4. Loading spinner during API calls
- R5. Clicking a result navigates to the post URL
- R6. Request dedup — no duplicate in-flight requests for the same query
- R7. Minimal UI matching the blog's existing color palette (light/dark mode)
- R8. No external JS dependencies — vanilla JS and CSS only
- R9. Performant — lightweight, no render-blocking resources

## Scope Boundaries

- No client-side search index or full-text search
- No search result caching (results are live from the API)
- No search history or recent searches
- No pagination of results (API returns `limit` items)
- No autocomplete or suggestion — only full search results

## Context & Research

### Relevant Code and Patterns

- `layouts/partials/header.html` — flex container with logo and nav, the search trigger should live in the nav area
- `layouts/partials/nav.html` — current nav links (Blog, TILs), new search trigger goes here
- `layouts/partials/custom_head.html` — inline CSS for logo and header, existing pattern for scoped styles
- `layouts/partials/custom_body.html` — currently empty, intended for body-end scripts per `baseof.html:33`
- `themes/hugo-bearblog/layouts/partials/style.html` — base theme colors:
  - Light: `background #fff`, `text #444`, `headings #222`, `links #3273dc`
  - Dark (`prefers-color-scheme: dark`): `background #333`, `text #ddd`, `headings #eee`, `links #8cc2dd`
  - Inputs dark: `background #252525`, `text #ddd`
- `layouts/_default/baseof.html` — includes `custom_head.html` in `<head>` and `custom_body.html` before `</body>`
- `hugo.toml` — permalinks: `/blog/:slug/`, `/til/:slug/`

### API Contract

```
POST https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/search
Content-Type: application/json
Body: { "query": "search terms", "limit": 5 }

Response: {
  "success": true,
  "data": {
    "items": [{
      "id": "...",
      "title": "...",
      "slug": "...",
      "postType": "...",
      "tags": ["..."],
      "publishedAt": "...",
      "excerpt": "...",
      "score": 0.62
    }],
    "total": 6
  },
  "message": "Search results"
}
```

The API will be updated to return a `url` field in each item. The implementation should use that `url` field for navigation.

## Key Technical Decisions

- **Vanilla JS, no dependencies**: The blog has zero JS dependencies. Adding a framework would be overkill for a single modal. Inline `<script>` in `custom_body.html` follows the existing pattern for inline `<style>` in `custom_head.html`.
- **Inline CSS + JS via Hugo partials**: Matches existing pattern — styles in `custom_head.html`, scripts in `custom_body.html`. No separate asset files needed.
- **Dedup via debounce + AbortController**: 300ms debounce to avoid firing on every keystroke, combined with AbortController to cancel stale requests. Balances responsiveness with API load.
- **Dark mode via `prefers-color-scheme`**: The blog uses this media query already. The modal CSS will use the same approach rather than a class toggle — consistent with existing theme behavior.
- **Netlify proxy for API**: The search API lives on `qblog.nesin.io` — a different origin from `aiengineerguide.com`. Rather than relying on CORS headers, use a Netlify rewrite rule in `static/_redirects` to proxy `/api/search` to the upstream API. This avoids cross-origin issues entirely and keeps the API endpoint configurable in one place.

## Open Questions

### Resolved During Planning

- **Result URL construction**: The API will return a `url` field per item. The implementation uses that directly rather than constructing URLs from `slug`/`postType`.

### Deferred to Implementation

- **Exact debounce timing**: 300ms is a reasonable starting point. Tune based on perceived latency during implementation.
- **Keyboard navigation within results (arrow keys)**: Not in scope per requirements, but straightforward to add later if desired.

## Implementation Units

- [ ] **Unit 1: Search trigger in navbar**

**Goal:** Add a clickable search button/icon to the navbar that opens the modal.

**Requirements:** R1

**Dependencies:** None

**Files:**
- Modify: `layouts/partials/nav.html`

**Approach:**
- Add a search trigger as an `<a>` element with `role="button"` and `href="#"` at the end of the nav links, so it inherits existing `nav a` styles. Use a simple SVG magnifying glass icon (inline) to avoid external icon dependencies.
- The button shows a keyboard shortcut hint (e.g., `⌘K` / `Ctrl+K`) as a subtle badge next to or inside the button. This badge should be hidden on mobile (keyboard shortcuts don't apply on touch devices).
- Clicking the button opens the search modal (wired up in Unit 3).
- Style consistently with existing nav links — using `<a>` with `role="button"` ensures automatic inheritance of `nav a` margin and color.

**Patterns to follow:**
- `layouts/partials/nav.html` — existing nav link pattern with `margin-right: 10px`
- `themes/hugo-bearblog/layouts/partials/style.html` — `nav a` styling, link color `#3273dc`

**Test scenarios:**
- Test expectation: none — visual/UI component, verified by visual inspection in browser

**Verification:**
- Search icon appears in the navbar alongside Blog and TILs links
- Clicking the icon opens the modal (once Unit 3 is wired)
- Icon is visible and aligned with other nav items on both mobile and desktop

---

- [ ] **Unit 2: Modal CSS styles**

**Goal:** Add inline CSS for the search modal, overlay, input, results, and spinner — matching the blog's light/dark color palette.

**Requirements:** R7

**Dependencies:** None

**Files:**
- Modify: `layouts/partials/custom_head.html`

**Approach:**
- Add a `<style>` block for all search modal elements, scoped with a `.search-modal` prefix to avoid collisions.
- Overlay: semi-transparent dark background (`rgba(0,0,0,0.5)`).
- Modal container: centered, white bg (`#fff`), border-radius, max-width ~500px.
- Input: full-width, styled to match existing input styles from theme (`font-size: 16px`).
- Results: list with subtle dividers, hover state with light background.
- Spinner: pure CSS spinner (border + animation), matching link color `#3273dc`.
- Dark mode: mirror `prefers-color-scheme: dark` using the same colors as theme — `#333` bg, `#ddd` text, `#252525` input bg.
- Mobile responsive: below ~600px breakpoint, modal is 90% viewport width with 16px padding; above breakpoint, max-width ~500px applies. The `⌘K`/`Ctrl+K` badge on the nav trigger is hidden on mobile (via the same breakpoint). Input `font-size` stays at 16px minimum to prevent iOS zoom-on-focus.

**Patterns to follow:**
- `themes/hugo-bearblog/layouts/partials/style.html` — color values for light/dark, input styling
- `layouts/partials/custom_head.html` — existing pattern of inline `<style>` blocks

**Test scenarios:**
- Test expectation: none — visual styling, verified by visual inspection in browser

**Verification:**
- Modal looks visually consistent with the blog in light mode
- Modal looks visually consistent in dark mode (`prefers-color-scheme: dark`)
- Spinner animation is smooth and visible
- Modal is usable on mobile viewports

---

- [ ] **Unit 3: Modal HTML and JavaScript logic**

**Goal:** Implement the search modal HTML structure, keyboard shortcut, open/close behavior, API integration with spinner and request dedup, and result rendering.

**Requirements:** R2, R3, R4, R5, R6, R8, R9

**Dependencies:** Unit 1 (trigger button), Unit 2 (styles)

**Files:**
- Modify: `layouts/partials/custom_body.html` — add modal HTML + inline `<script>`
- Modify: `static/_redirects` — add Netlify proxy rule for `/api/search` (file already exists with many redirect rules)

**Approach:**

**Modal HTML:**
- Overlay `div` + modal container with search input + results list container + spinner element.
- Hidden by default (`display: none`), toggled via JS.

**Keyboard shortcut:**
- Listen for `keydown` on `document`. On `Cmd+K` (Mac, `e.metaKey && e.key === 'k'`) or `Ctrl+K` (Windows/Linux, `e.ctrlKey && e.key === 'k'`), prevent default and toggle modal open.
- `Escape` closes the modal.
- Pressing `Cmd+K`/`Ctrl+K` while the modal is open closes it (toggle behavior).

**Accessibility:**
- Modal container gets `role="dialog"`, `aria-modal="true"`, `aria-label="Search"`.
- Tab key is trapped within the modal while open — focus cycles from last result back to the input.
- Results container has `aria-live="polite"` so screen readers announce when results appear.
- On close, focus returns to the trigger element that opened the modal.
- The trigger element in the nav should have `aria-label="Search blog"`.

**Open/close:**
- On open: show overlay/modal, focus the input field.
- On close: hide overlay/modal, clear input and results, return focus to trigger.
- Close on overlay click (outside modal).

**API integration with request dedup:**
- On input change (after 300ms debounce): if query is empty, clear results and return.
- Use an AbortController stored in a variable. Before each request, abort any previous controller and create a new one.
- Show spinner during fetch. On success, render results. On error (including abort), handle silently (abort is expected).
- POST to the proxied endpoint `/api/search` (Netlify rewrites to `https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/search`) with `{ query, limit: 5 }`.

**Result rendering:**
- Each result shows title, excerpt (truncated to ~2 lines via CSS `line-clamp` or ~120 characters), and tags (capped at 3 visible, overflow hidden).
- The entire result row is the click target (full-width clickable area with `cursor:pointer`), not just the title.
- Clicking a result navigates to `item.url`.
- Result items use `tabindex="0"` and Enter key navigates. Tab moves between results (acknowledged limitation for V1 — arrow-key navigation deferred).

**Error and empty states:**
- Zero results: display "No results for '[query]'" with a suggestion to try different terms.
- API/network error: display "Search is unavailable. Try again." with no query echo.
- API returns `success: false`: same as error state.

**Patterns to follow:**
- `layouts/partials/custom_body.html` — intended for body-end scripts per theme's `baseof.html`
- No existing JS patterns in the codebase — this is the first inline script

**Test scenarios:**
- Happy path: type query, see spinner briefly, results appear, click result navigates to correct URL
- Happy path: `Cmd+K` / `Ctrl+K` opens modal, `Escape` closes it
- Happy path: `Cmd+K` while modal is open closes it (toggle)
- Edge case: empty query shows no results and makes no API call
- Edge case: rapid typing aborts previous requests, only latest query result shows
- Edge case: click outside modal closes it
- Edge case: Tab key is trapped within modal while open
- Edge case: focus returns to trigger button when modal closes
- Error path: API returns error or network failure — shows "Search is unavailable" message
- Error path: API returns `success: false` — shows error state
- Error path: valid query returns zero results — shows "No results for '[query]'" message

**Verification:**
- `Cmd+K` / `Ctrl+K` opens the modal and focuses the input
- Typing a query shows the spinner, then results
- Clicking a result navigates to the correct page
- Only one in-flight request at a time (no duplicate API calls)
- Modal closes on `Escape`, overlay click, or selecting a result

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| CORS blocking cross-origin API calls | Netlify proxy via `static/_redirects` avoids cross-origin entirely — JS POSTs to `/api/search` on same origin |
| API `url` field not yet available | Implementation can fall back to constructing URL from `postType`/`slug` using Hugo permalink patterns as a temporary measure |
| CSP blocking inline scripts | If Netlify or future CSP config blocks inline scripts, move JS to `static/js/search.js` and reference from `custom_body.html` — minimal refactor |
| Dark mode flash on modal open | Modal uses `prefers-color-scheme` media query (same as theme), no FOUC risk |

## Sources & References

- Upstream API: `https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/search`
- Proxied endpoint: `/api/search` (Netlify rewrite in `static/_redirects`)
- Theme styles: `themes/hugo-bearblog/layouts/partials/style.html`
- Base layout: `layouts/_default/baseof.html`
- Existing redirects: `static/_redirects`
