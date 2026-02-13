import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { ReportsList } from "@/components/admin/reports-list";

export default async function AdminReportsPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: reports } = await supabase
    .from("listing_reports")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const listingIds = [...new Set((reports ?? []).map((r) => r.listing_id))];
  const { data: listings } = listingIds.length
    ? await supabase.from("listings").select("id, name, slug").in("id", listingIds)
    : { data: [] };
  const listingMap = Object.fromEntries((listings ?? []).map((l) => [l.id, l]));
  const reportsWithListings = (reports ?? []).map((r) => ({
    ...r,
    listings: listingMap[r.listing_id] ?? null,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <ReportsList reports={reportsWithListings} />
    </div>
  );
}
