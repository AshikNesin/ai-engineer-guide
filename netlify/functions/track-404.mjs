export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { url, referrer, userAgent } = body;

    // https://docs.netlify.com/functions/api/
    // Get client IP - Netlify provides this directly in context
    const clientIP = context.ip || "unknown";

    // Get geo information from Netlify context
    const city = context.geo?.city || "Unknown";
    const country = context.geo?.country?.name || "Unknown";

    // Device detection based on user agent
    const detectDevice = (ua) => {
      if (!ua) return "Unknown";
      
      const ua_lower = ua.toLowerCase();
      
      // Mobile devices
      if (/iphone|ipod/.test(ua_lower)) return "iPhone";
      if (/ipad/.test(ua_lower)) return "iPad";
      if (/android.*mobile/.test(ua_lower)) return "Android Phone";
      if (/android/.test(ua_lower)) return "Android Tablet";
      if (/windows phone/.test(ua_lower)) return "Windows Phone";
      
      // Desktop browsers
      if (/macintosh|mac os x/.test(ua_lower)) return "Mac";
      if (/windows nt/.test(ua_lower)) return "Windows";
      if (/linux/.test(ua_lower) && !/android/.test(ua_lower)) return "Linux";
      
      // Bots/crawlers
      if (/bot|crawler|spider|scraper/.test(ua_lower)) return "Bot/Crawler";
      
      return "Unknown";
    };
    
    const deviceType = detectDevice(userAgent);

    // Get timestamp
    const timestamp = new Date().toISOString();

    // Get Pushover credentials from environment
    const pushoverToken = Netlify.env.get("PUSHOVER_API_TOKEN");
    const pushoverUser = Netlify.env.get("PUSHOVER_USER_KEY");

    if (!pushoverToken || !pushoverUser) {
      console.error("Pushover credentials missing");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const message = `404 Page Hit
<b>URL:</b> ${url}
<b>IP:</b> ${clientIP}
<b>Location:</b> ${city}, ${country}
<b>Device:</b> ${deviceType}
<b>Referrer:</b> ${referrer || "Direct"}
<b>User Agent:</b> ${userAgent || "Unknown"}
<b>Time:</b> ${timestamp}`;

    // Send to Pushover using modern fetch
    const pushoverResponse = await fetch(
      "https://api.pushover.net/1/messages.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
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
