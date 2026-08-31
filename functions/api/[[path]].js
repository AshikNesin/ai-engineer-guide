/**
 * Cloudflare Pages Function: API proxy
 *
 * Proxies blog APIs to qblog.nesin.io. Replaces Netlify's _redirects proxy
 * rules, which had a redirect loop (/api/search/ -> /api/search/).
 *
 * Routes handled:
 *   POST /api/search  -> https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/search
 *   GET  /api/related -> https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/posts/related
 *
 * Trailing slashes are normalized (/api/search/ works too).
 */

const SEARCH_API =
  "https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/search";
const RELATED_API =
  "https://qblog.nesin.io/api/v1/public/blogs/AIEngineerGuide/posts/related";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

async function proxy(request, target) {
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(target);
  targetUrl.search = requestUrl.search; // forward query string

  const headers = new Headers();
  for (const header of ["content-type", "accept", "authorization"]) {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  }

  const init = { method: request.method, headers };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetUrl.toString(), init);

  const responseHeaders = new Headers(CORS_HEADERS);
  responseHeaders.set(
    "Content-Type",
    upstream.headers.get("Content-Type") || "application/json",
  );
  responseHeaders.set("Cache-Control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Normalize trailing slash: /api/search/ -> /api/search
  const path = new URL(request.url).pathname.replace(/\/+$/, "");

  if (path === "/api/search") return proxy(request, SEARCH_API);
  if (path === "/api/related") return proxy(request, RELATED_API);

  return json({ error: "Not found" }, 404);
}
