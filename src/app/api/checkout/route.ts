import { NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";

const DODO_PRODUCT_ID = process.env.DODO_PRODUCT_ID;

/** Extract listing slug from URL like .../directory/my-product, /directory/my-product, or just my-product */
function extractSlugFromListingUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const pathname = trimmed.startsWith("http") ? new URL(trimmed).pathname : trimmed;
    const match = pathname.match(/\/directory\/([^/]+)/);
    if (match) return match[1];
    if (/^[a-z0-9-]+$/i.test(pathname.replace(/^\//, ""))) return pathname.replace(/^\//, "");
    return null;
  } catch {
    return null;
  }
}

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
    const { email, listingUrl, weekStart: requestedWeek } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    if (!requestedWeek || typeof requestedWeek !== "string") {
      return NextResponse.json({ error: "Please select a week" }, { status: 400 });
    }

    let listingId: string | null = null;
    if (listingUrl && hasSupabase()) {
      const slug = extractSlugFromListingUrl(listingUrl);
      if (slug) {
        const supabase = createAdminClient();
        const { data } = await supabase
          .from("listings")
          .select("id")
          .eq("slug", slug)
          .eq("status", "published")
          .single();
        listingId = data?.id ?? null;
      }
    }

    if (hasSupabase()) {
      const supabase = createAdminClient();
      const { count } = await supabase
        .from("featured_slots")
        .select("*", { count: "exact", head: true })
        .eq("week_start_date", requestedWeek)
        .not("listing_id", "is", null);
      const filled = count ?? 0;
      if (filled >= FEATURED_SLOT_COUNT) {
        return NextResponse.json(
          { error: "No featured slots available for the selected week. Please choose another week." },
          { status: 400 }
        );
      }
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: DODO_PRODUCT_ID, quantity: 1 }],
      customer: { email },
      return_url: `${origin}/get-featured/success`,
      metadata: {
        listing_id: listingId ?? "",
        requested_week_start: requestedWeek,
        product_type: "homepage",
      },
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
