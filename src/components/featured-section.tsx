import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/types/database";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";

export async function FeaturedSection() {
  if (!hasSupabase()) {
    return (
      <section className="pb-10 md:pb-14">
        <h2 className="text-lg font-bold mb-5">Featured this week</h2>
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center text-muted-foreground">
          Configure Supabase to see featured listings.
        </div>
      </section>
    );
  }
  const supabase = createAdminClient();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const { data: slots } = await supabase
    .from("featured_slots")
    .select("listing_id")
    .eq("week_start_date", weekStartStr)
    .order("slot_number")
    .limit(FEATURED_SLOT_COUNT);

  const listingIds = (slots ?? [])
    .map((s) => s.listing_id)
    .filter((id): id is string => id != null);

  let listings: Listing[] = [];
  if (listingIds.length > 0) {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .in("id", listingIds)
      .eq("status", "published");
    listings = (data ?? []) as Listing[];
  }

  const { data: upvotes } = listingIds.length
    ? await supabase.from("listing_upvotes").select("listing_id")
    : { data: [] };
  const upvoteCounts: Record<string, number> = {};
  for (const u of upvotes ?? []) {
    upvoteCounts[u.listing_id] = (upvoteCounts[u.listing_id] ?? 0) + 1;
  }

  const orderedListings = listingIds
    .map((id) => listings.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => l != null);

  const filledCount = listingIds.length;
  const slotsAvailable = FEATURED_SLOT_COUNT - filledCount;

  if (orderedListings.length === 0) {
    return (
      <section className="pb-10 md:pb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Featured this week</h2>
          <Link href="/directory" className="text-sm text-primary hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground mb-3">No featured listings this week.</p>
          {slotsAvailable > 0 ? (
            <Link href="/get-featured" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Get your product featured →
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">All slots filled. Check back next week.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="pb-10 md:pb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">Featured this week</h2>
        <Link href="/directory" className="text-sm text-primary hover:underline font-medium">
          View all →
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {orderedListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            featured
            upvoteCount={upvoteCounts[listing.id] ?? 0}
          />
        ))}
      </div>
    </section>
  );
}
