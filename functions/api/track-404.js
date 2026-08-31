/**
 * Cloudflare Pages Function: 404 Page Tracking
 * Sends push notifications via Pushover when users hit 404 pages.
 *
 * Ported from netlify/functions/track-404.mjs
 * Environment variables required:
 *   PUSHOVER_API_TOKEN
 *   PUSHOVER_USER_KEY
 */

// Detect device type from user agent
function getDeviceType(userAgent) {
  if (!userAgent) return "Unknown";

  const ua = userAgent.toLowerCase();

  if (/iphone|ipod/.test(ua)) return "iPhone";
  if (/ipad/.test(ua)) return "iPad";
  if (/android.*mobile/.test(ua)) return "Android Phone";
  if (/android/.test(ua)) return "Android Tablet";
  if (/windows phone/.test(ua)) return "Windows Phone";
  if (/macintosh|mac os x/.test(ua)) return "Mac";
  if (/windows nt/.test(ua)) return "Windows";
  if (/linux/.test(ua) && !/android/.test(ua)) return "Linux";
  if (/bot|crawler|spider|scraper/.test(ua)) return "Bot/Crawler";

  return "Unknown";
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { url, referrer, userAgent } = await request.json();

    // Client info from Cloudflare request metadata
    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    const city = request.cf?.city || "Unknown";
    const country = request.cf?.country || "Unknown";
    const deviceType = getDeviceType(userAgent);
    const timestamp = new Date().toISOString();

    const pushoverToken = env.PUSHOVER_API_TOKEN;
    const pushoverUser = env.PUSHOVER_USER_KEY;

    if (!pushoverToken || !pushoverUser) {
      console.error("Pushover credentials missing");
      return json({ error: "Server configuration error" }, 500);
    }

    // Format notification message
    const message = `404 Page Hit
<b>URL:</b> <a href="${url}">${url}</a>
<b>IP:</b> ${clientIP}
<b>Location:</b> ${city}, ${country}
<b>Device:</b> ${deviceType}
<b>Referrer:</b> ${referrer || "Direct"}
<b>User Agent:</b> ${userAgent || "Unknown"}
<b>Time:</b> ${timestamp}`;

    // Send to Pushover
    const pushoverResponse = await fetch(
      "https://api.pushover.net/1/messages.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: pushoverToken,
          user: pushoverUser,
          message: message,
          title: "404 Error Alert",
          html: "1",
        }),
      },
    );

    if (!pushoverResponse.ok) {
      const errorText = await pushoverResponse.text();
      console.error("Pushover API error:", errorText);
      throw new Error("Failed to send notification");
    }

    return json({ success: true }, 200);
  } catch (error) {
    console.error("Error in 404 tracking:", error);
    return json({ error: "Internal server error" }, 500);
  }
}
