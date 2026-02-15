import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { getBaseUrl } from "@/lib/metadata";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function verifyCronAuth(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(req: Request) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  const base = getBaseUrl();
  const supabase = createAdminClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const { data: newListings } = await supabase
    .from("listings")
    .select("name, slug, tagline, category")
    .eq("status", "published")
    .gte("published_at", sevenDaysAgoStr)
    .order("published_at", { ascending: false })
    .limit(15);

  const { data: slots } = await supabase
    .from("featured_slots")
    .select("listing_id")
    .eq("week_start_date", weekStartStr)
    .order("slot_number")
    .limit(10);

  let featuredListings: { name: string; slug: string; category: string }[] = [];
  if (slots && slots.length > 0) {
    const ids = slots.map((s) => s.listing_id).filter((id): id is string => id != null);
    const { data } = await supabase
      .from("listings")
      .select("name, slug, category")
      .in("id", ids)
      .eq("status", "published");
    featuredListings = (data ?? []) as { name: string; slug: string; category: string }[];
  }

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .is("unsubscribed_at", null);

  const emails = (subscribers ?? []).map((s) => s.email).filter(Boolean);
  if (emails.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No subscribers" });
  }

  const newItemsHtml =
    (newListings ?? []).length > 0
      ? `
    <h2 style="font-size:18px;margin:16px 0 8px;">New this week</h2>
    <ul style="list-style:none;padding:0;">
      ${(newListings ?? [])
        .map(
          (l) =>
            `<li style="margin:8px 0;"><a href="${base}/directory/${l.slug}" style="color:#0066cc;">${l.name}</a> — ${l.tagline || l.category}</li>`
        )
        .join("")}
    </ul>
  `
      : "<p>No new listings this week.</p>";

  const featuredHtml =
    featuredListings.length > 0
      ? `
    <h2 style="font-size:18px;margin:16px 0 8px;">Featured this week</h2>
    <ul style="list-style:none;padding:0;">
      ${featuredListings
        .map(
          (l) =>
            `<li style="margin:8px 0;"><a href="${base}/directory/${l.slug}" style="color:#0066cc;">${l.name}</a> — ${l.category}</li>`
        )
        .join("")}
    </ul>
  `
      : "";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="font-size:24px;">BuiltWithOpenClaw Weekly Digest</h1>
      <p>Here's what's new in the OpenClaw ecosystem.</p>
      ${newItemsHtml}
      ${featuredHtml}
      <p style="margin-top:24px;">
        <a href="${base}" style="color:#0066cc;">Browse the full directory →</a>
      </p>
      <p style="margin-top:24px;font-size:12px;color:#666;">
        You're receiving this because you subscribed at BuiltWithOpenClaw.
      </p>
    </div>
  `;

  try {
    const batch = emails.map((to) => ({
      from: "BuiltWithOpenClaw <noreply@builtwithopenclaw.com>",
      to: [to],
      subject: "BuiltWithOpenClaw Weekly Digest — New Listings & Featured",
      html,
    }));

    const { data, error } = await resend.batch.send(batch);

    if (error) {
      console.error("Weekly digest error:", error);
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sent: emails.length, data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
