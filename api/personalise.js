// Vercel Serverless Function
// Holds the Anthropic API key securely (server-side) and proxies the quiz's
// personalisation requests to Claude. The key is NEVER sent to the browser.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Basic rate limiting (per-IP, in-memory) ──
  // Stops casual abuse. Resets when the function cold-starts, which is fine here.
  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  globalThis._rl = globalThis._rl || {};
  const last = globalThis._rl[ip] || 0;
  if (now - last < 2000) { // max 1 request per 2 seconds per IP
    return res.status(429).json({ error: "Too many requests, please slow down." });
  }
  globalThis._rl[ip] = now;

  try {
    const { messages, max_tokens } = req.body || {};
    if (!messages) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server is missing its API key." });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: Math.min(max_tokens || 1400, 1500), // safety cap
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: data?.error?.message || "Upstream error" });
    }

    // Pass the response straight through so the quiz parses it exactly as before.
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong generating personalisation." });
  }
}
