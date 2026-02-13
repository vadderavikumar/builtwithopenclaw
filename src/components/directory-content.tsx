import { ListingCard } from "@/components/listing-card";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

type Props = {
  params: { [key: string]: string | string[] | undefined };
};

export async function DirectoryContent({ params }: Props) {
  if (!hasSupabase()) {
    return (
      <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
        Configure Supabase to browse listings.
      </div>
    );
  }

  const supabase = createAdminClient();
  const category = typeof params.category === "string" ? params.category : null;
  const pricing = typeof params.pricing === "string" ? params.pricing : null;
  const hosting = typeof params.hosting === "string" ? params.hosting : null;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const q = typeof params.q === "string" ? params.q : null;

  let query = supabase.from("listings").select("*").eq("status", "published");

  if (category) query = query.eq("category", category);
  if (pricing) query = query.eq("pricing_type", pricing);
  if (hosting) query = query.eq("hosting_type", hosting);
  if (q) query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`);

  if (sort === "newest") {
    query = query.order("published_at", { ascending: false });
  } else if (sort === "upvotes") {
    query = query.order("published_at", { ascending: false });
  }
  const { data: listings } = await query;

  const ids = (listings ?? []).map((l) => l.id);
  const { data: upvotes } = ids.length
    ? await supabase.from("listing_upvotes").select("listing_id")
    : { data: [] };
  const upvoteCounts: Record<string, number> = {};
  for (const u of upvotes ?? []) {
    upvoteCounts[u.listing_id] = (upvoteCounts[u.listing_id] ?? 0) + 1;
  }

  if (sort === "upvotes" && listings) {
    listings.sort((a, b) => (upvoteCounts[b.id] ?? 0) - (upvoteCounts[a.id] ?? 0));
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  let featuredIds: string[] = [];
  if (sort === "featured") {
    const { data: slots } = await supabase
      .from("featured_slots")
      .select("listing_id")
      .eq("week_start_date", weekStartStr)
      .order("slot_number");
    featuredIds = (slots ?? []).map((s) => s.listing_id).filter((id): id is string => id != null);
  }

  let orderedListings = listings ?? [];
  if (sort === "featured" && featuredIds.length > 0) {
    const featured = orderedListings.filter((l) => featuredIds.includes(l.id));
    const rest = orderedListings.filter((l) => !featuredIds.includes(l.id));
    const orderBySlot = featuredIds
      .map((id) => featured.find((l) => l.id === id))
      .filter((l): l is NonNullable<typeof l> => l != null);
    orderedListings = [...orderBySlot, ...rest];
  }

  if (orderedListings.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
        No listings match your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {orderedListings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          featured={featuredIds.includes(listing.id)}
          upvoteCount={upvoteCounts[listing.id] ?? 0}
        />
      ))}
    </div>
  );
}
