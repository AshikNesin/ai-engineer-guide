// Analytics helper. Sends an Umami event name plus a few fixed, non-user
// properties. Never pass anything the visitor typed or pasted.
export function track(event, props = {}) {
  try {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(event, props);
    }
  } catch (_) {
    /* analytics must never break the tool */
  }
}

// Fire `tool_used` once per page view, the first time the visitor interacts.
let used = false;
export function trackUsedOnce(tool) {
  if (used) return;
  used = true;
  track("tool_used", { tool });
}
