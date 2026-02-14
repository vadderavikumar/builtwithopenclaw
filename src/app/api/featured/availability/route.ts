import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";

/** Get current week's Monday date string */
function getWeekStartStr(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  return weekStart.toISOString().split("T")[0];
}

export async function GET() {
  if (!hasSupabase()) {
    return NextResponse.json({ available: 0, total: FEATURED_SLOT_COUNT });
  }

  const supabase = createAdminClient();
  const weekStartStr = getWeekStartStr();

  const { count } = await supabase
    .from("featured_slots")
    .select("*", { count: "exact", head: true })
    .eq("week_start_date", weekStartStr)
    .not("listing_id", "is", null);

  const filled = count ?? 0;
  const available = Math.max(0, FEATURED_SLOT_COUNT - filled);

  return NextResponse.json({
    available,
    total: FEATURED_SLOT_COUNT,
    filled,
    weekStart: weekStartStr,
  });
}
