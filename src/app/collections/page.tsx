import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Collections",
  description:
    "Curated collections of OpenClaw products. Browse themed lists of SaaS, plugins, skills, and extensions.",
  path: "/collections",
  keywords: ["OpenClaw collections", "OpenClaw favorites", "curated OpenClaw"],
});

export default async function CollectionsPage() {
  if (!hasSupabase()) {
    return (
      <div className="container px-4 py-12">
        <h1 className="text-2xl font-bold">Collections</h1>
        <p className="text-muted-foreground mt-2">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Collections</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(collections ?? []).map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="rounded-lg border p-6 hover:border-primary/50 transition-colors"
          >
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{(c.listing_ids ?? []).length} listings</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
