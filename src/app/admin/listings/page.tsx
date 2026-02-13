import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";

export default async function AdminListingsPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Listings</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Listings</h1>
      <div className="space-y-2">
        {(listings ?? []).map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Link href={`/directory/${l.slug}`} className="font-semibold hover:underline">
                {l.name}
              </Link>
              <p className="text-sm text-muted-foreground">{l.slug} · {l.status}</p>
            </div>
            <div className="flex gap-2">
              <form action={`/api/admin/listings/${l.id}/unlist`} method="POST">
                <Button size="sm" variant="outline" type="submit">
                  {l.status === "published" ? "Unlist" : "Publish"}
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
