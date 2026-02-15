import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { weekStart, slotNumber, listingId } = await req.json();
    if (!weekStart || !slotNumber || !listingId) {
      return NextResponse.json({ error: "weekStart, slotNumber, listingId required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("blog_featured_slots").upsert(
      { week_start_date: weekStart, slot_number: slotNumber, listing_id: listingId },
      { onConflict: "week_start_date,slot_number" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Assign failed" }, { status: 500 });
  }
}
