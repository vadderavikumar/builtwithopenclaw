import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { ListingCard } from "@/components/listing-card";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) return { title: "Collection" };
  const supabase = createAdminClient();
  const { data } = await supabase.from("collections").select("title, description").eq("slug", slug).single();
  if (!data) return { title: "Collection" };
  return buildMetadata({
    title: data.title,
    description: data.description || `Curated collection of OpenClaw products: ${data.title}`,
    path: `/collections/${slug}`,
    keywords: ["OpenClaw", data.title, "collection"],
  });
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) notFound();

  const supabase = createAdminClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!collection) notFound();

  const ids = collection.listing_ids ?? [];
  const { data: listings } = ids.length
    ? await supabase.from("listings").select("*").in("id", ids).eq("status", "published")
    : { data: [] };

  const { data: upvotes } = ids.length
    ? await supabase.from("listing_upvotes").select("listing_id")
    : { data: [] };
  const upvoteCounts: Record<string, number> = {};
  for (const u of upvotes ?? []) {
    upvoteCounts[u.listing_id] = (upvoteCounts[u.listing_id] ?? 0) + 1;
  }

  const ordered = (ids as string[])
    .map((id) => (listings ?? []).find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => l != null);

  return (
    <div className="container px-4 py-12">
      <Link href="/collections" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        Back to collections
      </Link>
      <h1 className="text-2xl font-bold">{collection.title}</h1>
      {collection.description && (
        <p className="text-muted-foreground mt-2">{collection.description}</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {ordered.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            upvoteCount={upvoteCounts[listing.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
