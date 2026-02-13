import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminCollectionsPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Collections</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Collections</h1>
      <div className="space-y-2">
        {(collections ?? []).map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Link href={`/collections/${c.slug}`} className="font-semibold hover:underline">
                {c.title}
              </Link>
              <p className="text-sm text-muted-foreground">{c.slug} · {(c.listing_ids ?? []).length} listings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
