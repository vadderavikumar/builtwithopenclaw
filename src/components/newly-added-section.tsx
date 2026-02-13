import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function NewlyAddedSection() {
  if (!hasSupabase()) {
    return (
      <section className="border-b py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-semibold mb-6">Newly added</h2>
          <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
            Configure Supabase to see listings.
          </div>
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
      <section className="border-b py-16">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Newly added</h2>
            <Link href="/directory" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="rounded-lg border bg-muted/30 p-12 text-center text-muted-foreground">
            No listings yet.{" "}
            <Link href="/submit" className="text-primary hover:underline">
              Be the first to submit
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
          <h2 className="text-2xl font-semibold">Newly added</h2>
          <Link href="/directory" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              upvoteCount={upvoteCounts[listing.id] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
