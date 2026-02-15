import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { BLOG_FEATURED_SLOT_COUNT } from "@/lib/utils";

function getWeekStartStr(d: Date): string {
  const dayOfWeek = d.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() + mondayOffset);
  return weekStart.toISOString().split("T")[0];
}

function addWeeks(d: Date, weeks: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + weeks * 7);
  return out;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const weeksParam = searchParams.get("weeks");
  const weeks = weeksParam ? Math.min(Math.max(1, parseInt(weeksParam, 10)), 12) : 1;

  if (!hasSupabase()) {
    const today = new Date();
    const single = {
      weekStart: getWeekStartStr(today),
      available: 0,
      total: BLOG_FEATURED_SLOT_COUNT,
      filled: 0,
    };
    return NextResponse.json(weeks === 1 ? single : { weeks: [single] });
  }

  const supabase = createAdminClient();
  const today = new Date();

  if (weeks === 1) {
    const weekStartStr = getWeekStartStr(today);
    const { count } = await supabase
      .from("blog_featured_slots")
      .select("*", { count: "exact", head: true })
      .eq("week_start_date", weekStartStr)
      .not("listing_id", "is", null);
    const filled = count ?? 0;
    return NextResponse.json({
      weekStart: weekStartStr,
      available: Math.max(0, BLOG_FEATURED_SLOT_COUNT - filled),
      total: BLOG_FEATURED_SLOT_COUNT,
      filled,
    });
  }

  const weekStarts: string[] = [];
  for (let i = 0; i < weeks; i++) {
    weekStarts.push(getWeekStartStr(addWeeks(today, i)));
  }

  const { data: slots } = await supabase
    .from("blog_featured_slots")
    .select("week_start_date")
    .in("week_start_date", weekStarts)
    .not("listing_id", "is", null);

  const filledByWeek: Record<string, number> = {};
  for (const ws of weekStarts) filledByWeek[ws] = 0;
  for (const s of slots ?? []) {
    if (s.week_start_date) {
      filledByWeek[s.week_start_date] = (filledByWeek[s.week_start_date] ?? 0) + 1;
    }
  }

  const result = weekStarts.map((weekStart) => {
    const filled = filledByWeek[weekStart] ?? 0;
    return {
      weekStart,
      available: Math.max(0, BLOG_FEATURED_SLOT_COUNT - filled),
      total: BLOG_FEATURED_SLOT_COUNT,
      filled,
    };
  });

  return NextResponse.json({ weeks: result });
}
