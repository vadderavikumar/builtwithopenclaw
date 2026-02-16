import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import Link from "next/link";
import { GitHubImport } from "@/components/admin/github-import";

export default async function AdminDashboardPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();

  const [
    { count: pendingCount },
    { count: listingsCount },
    { count: reportsCount },
    { count: blogPublishedCount },
  ] = await Promise.all([
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("listing_reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
  ]);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const { count: featuredCount } = await supabase
    .from("featured_slots")
    .select("*", { count: "exact", head: true })
    .eq("week_start_date", weekStartStr);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/submissions" className="rounded-lg border p-4 hover:bg-muted/50">
          <p className="text-sm text-muted-foreground">Pending submissions</p>
          <p className="text-2xl font-bold">{pendingCount ?? 0}</p>
        </Link>
        <Link href="/admin/listings" className="rounded-lg border p-4 hover:bg-muted/50">
          <p className="text-sm text-muted-foreground">Published listings</p>
          <p className="text-2xl font-bold">{listingsCount ?? 0}</p>
        </Link>
        <Link href="/admin/featured" className="rounded-lg border p-4 hover:bg-muted/50">
          <p className="text-sm text-muted-foreground">Featured this week</p>
          <p className="text-2xl font-bold">{featuredCount ?? 0}/10</p>
        </Link>
        <Link href="/admin/reports" className="rounded-lg border p-4 hover:bg-muted/50">
          <p className="text-sm text-muted-foreground">Pending reports</p>
          <p className="text-2xl font-bold">{reportsCount ?? 0}</p>
        </Link>
        <Link href="/admin/blog" className="rounded-lg border p-4 hover:bg-muted/50">
          <p className="text-sm text-muted-foreground">Published blog posts</p>
          <p className="text-2xl font-bold">{blogPublishedCount ?? 0}</p>
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">GitHub Import</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Paste a GitHub repo URL to pre-fill listing data from the repo metadata and README.
        </p>
        <GitHubImport />
      </div>
    </div>
  );
}
