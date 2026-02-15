import { Suspense } from "react";
import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/metadata";
import { ProductCard } from "@/components/product-card";
import type { Listing } from "@/types/database";

export const metadata = buildMetadata({
  title: "New This Week",
  description:
    "Recently added products built with OpenClaw. Discover the latest SaaS, plugins, skills, and extensions.",
  path: "/new",
  keywords: ["OpenClaw new", "OpenClaw latest", "new OpenClaw products"],
});

export default async function NewThisWeekPage() {
  if (!hasSupabase()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Configure Supabase to view listings.
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .gte("published_at", sevenDaysAgoStr)
    .order("published_at", { ascending: false });

  const newListings = (listings ?? []) as Listing[];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          ← Back to home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          New this week
        </h1>
        <p className="text-muted-foreground mb-8">
          Products added to the directory in the last 7 days.
        </p>

        {newListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newListings.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            <p>No new products this week. Check back soon!</p>
            <Link href="/directory" className="text-primary hover:underline mt-2 inline-block">
              Browse all listings →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
