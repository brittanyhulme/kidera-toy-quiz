// Vercel Serverless Function: Mailchimp signup
// Adds a subscriber to the Kidera Mailchimp audience.
// The Mailchimp API key is held securely server-side (never in the browser).

import crypto from "crypto";

const DC = "us12"; // Mailchimp data center / server prefix
const LIST_ID = "ea68a39776"; // Kidera audience ID

// Only these tag prefixes are accepted from the browser, so a caller
// cannot write arbitrary tags into the audience.
const ALLOWED_PREFIXES = ["quiz-", "deck-", "freebie-", "waitlist-"];

function cleanTags(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter((t) => typeof t === "string")
    .map((t) => t.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").slice(0, 40))
    .filter((t) => t.length > 2 && ALLOWED_PREFIXES.some((p) => t.startsWith(p)))
    .slice(0, 4);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // -- Basic rate limiting (per-IP) --
  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  globalThis._rlSub = globalThis._rlSub || {};
  if (now - (globalThis._rlSub[ip] || 0) < 3000) {
    return res.status(429).json({ error: "Please slow down a moment." });
  }
  globalThis._rlSub[ip] = now;

  try {
    const { email, tags } = req.body || {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server is missing its Mailchimp key." });
    }

    // "toy-quiz" is always applied so existing segments keep working.
    // Any extra source tags from the client are sanitised first.
    const finalTags = ["toy-quiz", ...cleanTags(tags)];

    // Mailchimp uses an MD5 hash of the lowercased email as the member ID.
    // Using PUT to this endpoint adds OR updates, so re-signups do not error.
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
        status_if_new: "subscribed",
        tags: finalTags,
      }),
    });

    const data = await mcRes.json();

    if (mcRes.ok) {
      return res.status(200).json({ ok: true, tags: finalTags });
    }

    // Already subscribed is a success from the user point of view.
    if (data?.title === "Member Exists") {
      return res.status(200).json({ ok: true, already: true });
    }

    return res.status(mcRes.status).json({ error: data?.detail || "Could not sign up right now." });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong signing you up." });
  }
}
