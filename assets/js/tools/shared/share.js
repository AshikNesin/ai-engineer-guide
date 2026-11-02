// Share links: tool inputs live in the URL hash (#a=1&b=2), never in the
// query string, so they aren't sent to the server. Never put secrets here.
export function readHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  return Object.fromEntries(params.entries());
}

export function writeHash(values) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) {
    if (v !== "" && v !== null && v !== undefined && v !== false) params.set(k, String(v));
  }
  const hash = params.toString();
  history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
}

export function shareUrl() {
  return location.href;
}
