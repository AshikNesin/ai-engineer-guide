/**
 * Netlify Function: 404 Page Tracking
 * Sends push notifications when users hit 404 pages
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

export default async (req, context) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get request data
    const { url, referrer, userAgent } = await req.json();

    // Get client info from Netlify context
    const clientIP = context.ip || "unknown";
    const city = context.geo?.city || "Unknown";
    const country = context.geo?.country?.name || "Unknown";
    const deviceType = getDeviceType(userAgent);
    const timestamp = new Date().toISOString();

    // Get Pushover credentials
    const pushoverToken = Netlify.env.get("PUSHOVER_API_TOKEN");
    const pushoverUser = Netlify.env.get("PUSHOVER_USER_KEY");

    if (!pushoverToken || !pushoverUser) {
      console.error("Pushover credentials missing");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
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
          priority: "0",
          html: "1",
        }),
      },
    );

    if (!pushoverResponse.ok) {
      const errorText = await pushoverResponse.text();
      console.error("Pushover API error:", errorText);
      throw new Error("Failed to send notification");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in 404 tracking:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
