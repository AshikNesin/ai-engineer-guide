/**
 * 301 duplicate hosts to https://aiengineerguide.com, keeping path and query.
 *
 * Cloudflare Pages `_redirects` cannot match on hostname, so www and the
 * production *.pages.dev alias keep serving a full 200 copy unless this runs.
 * Preview aliases (<branch-or-hash>.<project>.pages.dev) are not redirected,
 * so a branch deploy stays reviewable. Local wrangler hosts are not redirected.
 *
 * Calls next() for the apex, so static files and the path rules in
 * static/_redirects still apply.
 */

const CANONICAL_HOST = "aiengineerguide.com";

export function requestHost(request) {
  const header = request.headers.get("host");
  const raw = header || new URL(request.url).host || "";
  return raw.split(":")[0].trim().toLowerCase().replace(/\.$/, "");
}

export function shouldRedirectHost(host) {
  if (!host || host === CANONICAL_HOST) return false;
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]"
  ) {
    return false;
  }
  // <preview>.<project>.pages.dev has 4+ labels. The bare production alias
  // <project>.pages.dev has 3 and must redirect.
  if (host.endsWith(".pages.dev") && host.split(".").length >= 4) return false;
  return true;
}

export function canonicalURL(requestUrl) {
  const dest = new URL(requestUrl);
  dest.protocol = "https:";
  dest.hostname = CANONICAL_HOST;
  dest.port = "";
  return dest;
}

export async function onRequest(context) {
  const { request } = context;
  // Host is the name the browser used. request.url can differ behind the
  // edge, so the decision is based on Host and the Location is rebuilt
  // from the request URL with only the host changed.
  if (!shouldRedirectHost(requestHost(request))) return context.next();
  return Response.redirect(canonicalURL(request.url).href, 301);
}
