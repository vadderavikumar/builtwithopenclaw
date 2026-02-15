import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FeaturedCalendar } from "@/components/admin/featured-calendar";

export default async function AdminFeaturedPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Featured Slots</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const [{ data: listings }, { data: purchases }] = await Promise.all([
    supabase.from("listings").select("id, name, slug").eq("status", "published").order("name"),
    supabase
      .from("purchases")
      .select("id, email, requested_week_start, listing_id, created_at")
      .eq("status", "paid")
      .or("product_type.eq.homepage,product_type.is.null")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Featured Slots</h1>
      <FeaturedCalendar
        listings={listings ?? []}
        purchases={purchases ?? []}
      />
    </div>
  );
}
