import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function NewlyAddedSection() {
  if (!hasSupabase()) {
    return (
      <section className="pt-10 md:pt-14 border-t">
        <h2 className="text-lg font-bold mb-5">Newly added</h2>
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center text-muted-foreground">
          Configure Supabase to see listings.
        </div>
      </section>
    );
  }
  const supabase = createAdminClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(8);

  const ids = (listings ?? []).map((l) => l.id);
  const { data: upvotes } = ids.length
    ? await supabase.from("listing_upvotes").select("listing_id")
    : { data: [] };
  const upvoteCounts: Record<string, number> = {};
  for (const u of upvotes ?? []) {
    upvoteCounts[u.listing_id] = (upvoteCounts[u.listing_id] ?? 0) + 1;
  }

  if (!listings || listings.length === 0) {
    return (
      <section className="pt-10 md:pt-14 border-t">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Newly added</h2>
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
    <section className="pt-10 md:pt-14 border-t">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">Newly added</h2>
        <Link href="/directory" className="text-sm text-primary hover:underline font-medium">
          View all →
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            upvoteCount={upvoteCounts[listing.id] ?? 0}
          />
        ))}
      </div>
    </section>
  );
}
