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
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, slug")
    .eq("status", "published")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Featured Slots</h1>
      <FeaturedCalendar listings={listings ?? []} />
    </div>
  );
}
