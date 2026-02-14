import Link from "next/link";
import { Search } from "lucide-react";
import { FeaturedCard } from "@/components/featured-card";
import { ListingRow } from "@/components/listing-row";
import type { Listing } from "@/types/database";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";

export async function ListingsSection() {
  if (!hasSupabase()) {
    return (
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">All listings</h2>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center text-muted-foreground">
          Configure Supabase to see listings.
        </div>
      </section>
    );
  }

  const supabase = createAdminClient();

  // Get featured listings for this week
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

  const featuredIds = (slots ?? [])
    .map((s) => s.listing_id)
    .filter((id): id is string => id != null);

  let featuredListings: Listing[] = [];
  if (featuredIds.length > 0) {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .in("id", featuredIds)
      .eq("status", "published");
    featuredListings = (data ?? []) as Listing[];
  }

  const orderedFeatured = featuredIds
    .map((id) => featuredListings.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => l != null);

  // Get newly added (more than we need, we'll filter duplicates)
  const { data: newListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(15);

  const featuredIdSet = new Set(featuredIds);
  const restListings = (newListings ?? []).filter((l) => !featuredIdSet.has(l.id)).slice(0, 12);

  if (orderedFeatured.length === 0 && restListings.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">All listings</h2>
          <Link href="/directory" className="text-sm text-primary hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground mb-3">No listings yet.</p>
          <Link href="/submit" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Be the first to submit →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Featured section - colorful cards */}
      {orderedFeatured.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {orderedFeatured.slice(0, 6).map((listing, i) => (
            <FeaturedCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}

      {/* Search bar */}
      <form action="/directory" method="GET" className="w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            name="q"
            placeholder="Search products..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border-0 bg-zinc-100 dark:bg-zinc-800/80 text-sm placeholder:text-zinc-400 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
          />
        </div>
      </form>

      {/* Normal listing - row format */}
      {restListings.length > 0 && (
        <div>
          <div className="rounded-xl overflow-hidden bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-700">
            {restListings.slice(0, 12).map((listing, i) => (
              <ListingRow key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 text-center">
        <Link href="/directory" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          View all →
        </Link>
      </div>
    </section>
  );
}
