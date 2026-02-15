import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

function getFingerprint(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  return Buffer.from(`${ip}:${ua}`).toString("base64").slice(0, 64);
}

export async function POST(req: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { listingId, helpful } = body;

    if (!listingId || typeof helpful !== "boolean") {
      return NextResponse.json(
        { error: "listingId and helpful (boolean) required" },
        { status: 400 }
      );
    }

    const fingerprint = getFingerprint(req);
    const supabase = createAdminClient();

    const { error } = await supabase.from("listing_feedback").upsert(
      { listing_id: listingId, helpful, fingerprint },
      { onConflict: "listing_id,fingerprint" }
    );

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Feedback failed" }, { status: 500 });
  }
}
