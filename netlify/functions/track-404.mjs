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

    // Get client IP from various headers
    const clientIP =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      context.ip ||
      "unknown";

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
URL: ${url}
IP: ${clientIP}
Referrer: ${referrer || "Direct"}
User Agent: ${userAgent || "Unknown"}
Time: ${timestamp}`;

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
