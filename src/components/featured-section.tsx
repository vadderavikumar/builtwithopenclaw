import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import type { Listing } from "@/types/database";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";

export async function FeaturedSection() {
  if (!hasSupabase()) {
    return (
      <section className="border-b py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-semibold mb-6">Featured this week</h2>
          <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
            Configure Supabase to see featured listings.
          </div>
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

  if (orderedListings.length === 0) {
    return (
      <section className="border-b py-16">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured this week</h2>
            <Link href="/directory" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
            No featured listings this week.{" "}
            <Link href="/get-featured" className="text-primary hover:underline">
              Get featured
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b py-16">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured this week</h2>
          <Link href="/directory" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {orderedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              featured
              upvoteCount={upvoteCounts[listing.id] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
