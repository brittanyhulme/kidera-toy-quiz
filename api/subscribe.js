// Vercel Serverless Function: Mailchimp signup
// Adds a subscriber to the Kidera Mailchimp audience.
// The Mailchimp API key is held securely server-side (never in the browser).

import crypto from "crypto";

const DC = "us12"; // Mailchimp data center / server prefix
const LIST_ID = "ea68a39776"; // Kidera audience ID

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Basic rate limiting (per-IP) ──
  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  globalThis._rlSub = globalThis._rlSub || {};
  if (now - (globalThis._rlSub[ip] || 0) < 3000) {
    return res.status(429).json({ error: "Please slow down a moment." });
  }
  globalThis._rlSub[ip] = now;

  try {
    const { email } = req.body || {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server is missing its Mailchimp key." });
    }

    // Mailchimp uses an MD5 hash of the lowercased email as the member ID.
    // Using PUT to this endpoint adds OR updates, so re-signups don't error.
    const subscriberHash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    const url = `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`;

    const mcRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email,
        // "subscribed" = they're on the list immediately.
        // If your audience uses double opt-in, change this to "pending"
        // and Mailchimp will email them a confirmation link.
        status_if_new: "subscribed",
        tags: ["toy-quiz"],
      }),
    });

    const data = await mcRes.json();

    if (mcRes.ok) {
      return res.status(200).json({ ok: true });
    }

    // Already subscribed is a success from the user's point of view.
    if (data?.title === "Member Exists") {
      return res.status(200).json({ ok: true, already: true });
    }

    return res.status(mcRes.status).json({ error: data?.detail || "Could not sign up right now." });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong signing you up." });
  }
}
