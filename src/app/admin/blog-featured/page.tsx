import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { BlogFeaturedCalendar } from "@/components/admin/blog-featured-calendar";

export default async function AdminBlogFeaturedPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Blog Featured</h1>
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
      .eq("product_type", "blog")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blog Featured ($29/week)</h1>
      <p className="text-muted-foreground mb-6">5 slots per week. Assign listings to blog featured slots.</p>
      <BlogFeaturedCalendar
        listings={listings ?? []}
        purchases={purchases ?? []}
      />
    </div>
  );
}
