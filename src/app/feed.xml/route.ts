import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";

  let items = "";
  if (hasSupabase()) {
    const supabase = createAdminClient();
    const { data: listings } = await supabase
      .from("listings")
      .select("slug, name, tagline, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20);

    items = (listings ?? [])
      .map(
        (l) => `
    <item>
      <title><![CDATA[${escapeXml(l.name)}]]></title>
      <description><![CDATA[${escapeXml(l.tagline)}]]></description>
      <link>${base}/directory/${l.slug}</link>
      <pubDate>${new Date(l.published_at ?? l.slug).toUTCString()}</pubDate>
    </item>`
      )
      .join("");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BuiltWithOpenClaw - New Listings</title>
    <link>${base}</link>
    <description>New products built with OpenClaw</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
