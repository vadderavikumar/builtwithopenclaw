import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { listingId, reason, details } = await req.json();
    if (!listingId || !reason) {
      return NextResponse.json({ error: "listingId and reason required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    await supabase.from("listing_reports").insert({
      listing_id: listingId,
      reason,
      details: details || null,
      status: "pending",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Report failed" }, { status: 500 });
  }
}
