import { NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";

const DODO_PRODUCT_ID = process.env.DODO_PRODUCT_ID;

function getWeekStartStr(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  return weekStart.toISOString().split("T")[0];
}

export async function POST(req: Request) {
  if (!dodo || !DODO_PRODUCT_ID) {
    return NextResponse.json({ error: "Dodo Payments not configured" }, { status: 500 });
  }

  try {
    const { email, listingId } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (hasSupabase()) {
      const supabase = createAdminClient();
      const weekStartStr = getWeekStartStr();
      const { count } = await supabase
        .from("featured_slots")
        .select("*", { count: "exact", head: true })
        .eq("week_start_date", weekStartStr)
        .not("listing_id", "is", null);
      const filled = count ?? 0;
      if (filled >= FEATURED_SLOT_COUNT) {
        return NextResponse.json(
          { error: "No featured slots available this week. All slots are filled." },
          { status: 400 }
        );
      }
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: DODO_PRODUCT_ID, quantity: 1 }],
      customer: { email, name: "" },
      return_url: `${origin}/get-featured/success`,
      metadata: { listing_id: listingId ?? "" },
    });

    const checkoutUrl = (session as { checkout_url?: string }).checkout_url;
    if (!checkoutUrl) {
      throw new Error("No checkout URL returned");
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
