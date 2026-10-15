// Handles people who are ALREADY on the main Kidera list and fill in a form again.
// The hosted Mailchimp form can't update existing contacts, so the site calls this instead.
//
// POST JSON { email, kind, plist? }
//   kind "already"      -> re-adds the "already-subscribed" tag, which sends the
//                          "You're already on the list" email (max once a day per person)
//   kind "packing_list" -> saves their packing list link in PLIST and re-adds the
//                          "packing-list" tag, which sends the packing list email
//                          (max once every 5 minutes per person, matching the flow re-entry setting)
//
// Only acts on contacts who are already subscribed. Anyone else gets { status: "not_member" }
// and the page falls back to the normal signup form, so new signups still go through
// Mailchimp's own form (and its confirmation step if that's switched on).
//
// Uses the MAILCHIMP_API_KEY env var that api/subscribe.js already uses.

import crypto from "crypto";

const LIST_ID = "ea68a39776"; // main Kidera audience
const ALLOWED_ORIGINS = ["https://kidera.com.au", "https://www.kidera.com.au"];
const KINDS = {
  already: { tag: "already-subscribed", minGapMs: 24 * 60 * 60 * 1000 },
  packing_list: { tag: "packing-list", minGapMs: 5 * 60 * 1000 },
};
const PLIST_PREFIX = "https://kidera.com.au/packing-list";

function cors(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function validEmail(v) {
  return typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function validPlist(v) {
  return typeof v === "string" && v.length <= 255 && v.startsWith(PLIST_PREFIX) && !/[\s<>"']/.test(v);
}

export async function handle(body, { apiKey, fetchImpl = fetch, now = Date.now() }) {
  const email = String((body && body.email) || "").trim().toLowerCase();
  const kind = body && body.kind;
  if (!validEmail(email) || !KINDS[kind]) return [400, { status: "bad_request" }];
  if (kind === "packing_list" && !validPlist(body.plist)) return [400, { status: "bad_request" }];
  if (!apiKey) return [500, { status: "error" }];

  const dc = "us12"; // same data center as api/subscribe.js
  const hash = crypto.createHash("md5").update(email).digest("hex");
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`;
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const mc = async (path, method = "GET", payload) => {
    const r = await fetchImpl(base + path, { method, headers, body: payload ? JSON.stringify(payload) : undefined });
    const text = await r.text();
    let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) {}
    return { ok: r.ok, status: r.status, data };
  };

  const member = await mc("");
  if (member.status === 404) return [200, { status: "not_member" }];
  if (!member.ok) return [502, { status: "error" }];
  if (member.data.status !== "subscribed") return [200, { status: "not_member" }];

  const cfg = KINDS[kind];
  const tags = await mc("/tags?count=100");
  const existing = ((tags.data && tags.data.tags) || []).find((t) => t.name === cfg.tag);
  if (existing && existing.date_added && now - Date.parse(existing.date_added) < cfg.minGapMs) {
    return [200, { status: "recently_sent" }];
  }

  if (kind === "packing_list") {
    const upd = await mc("", "PATCH", { merge_fields: { PLIST: body.plist } });
    if (!upd.ok) return [502, { status: "error" }];
  }

  // Remove then re-add the tag so the "tag added" automation fires again.
  if (existing) await mc("/tags", "POST", { tags: [{ name: cfg.tag, status: "inactive" }] });
  const add = await mc("/tags", "POST", { tags: [{ name: cfg.tag, status: "active" }] });
  if (!add.ok) return [502, { status: "error" }];
  return [200, { status: "sent" }];
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ status: "method_not_allowed" });

  // Basic per-IP rate limiting, same approach as api/subscribe.js
  const ip = (req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const t = Date.now();
  globalThis._rlResub = globalThis._rlResub || {};
  if (t - (globalThis._rlResub[ip] || 0) < 3000) return res.status(429).json({ status: "slow_down" });
  globalThis._rlResub[ip] = t;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const [code, out] = await handle(body, { apiKey: process.env.MAILCHIMP_API_KEY });
    return res.status(code).json(out);
  } catch (e) {
    return res.status(500).json({ status: "error" });
  }
}
