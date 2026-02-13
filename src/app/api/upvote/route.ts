import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

function getFingerprint(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  return Buffer.from(`${ip}:${ua}`).toString("base64").slice(0, 64);
}

export async function POST(req: Request) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }

    const fingerprint = getFingerprint(req);
    const supabase = createAdminClient();

    const { error } = await supabase.from("listing_upvotes").upsert(
      { listing_id: listingId, fingerprint },
      { onConflict: "listing_id,fingerprint", ignoreDuplicates: true }
    );

    if (error) {
      if (error.code === "23505") {
        const { count } = await supabase
          .from("listing_upvotes")
          .select("*", { count: "exact", head: true })
          .eq("listing_id", listingId);
        return NextResponse.json({ count: count ?? 0 });
      }
      throw error;
    }

    const { count } = await supabase
      .from("listing_upvotes")
      .select("*", { count: "exact", head: true })
      .eq("listing_id", listingId);

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upvote failed" }, { status: 500 });
  }
}
