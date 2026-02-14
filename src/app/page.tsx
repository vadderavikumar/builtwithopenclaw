import { Suspense } from "react";
import { HomePageClient } from "@/components/home-page-client";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { FEATURED_SLOT_COUNT } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";
import type { Listing } from "@/types/database";

export const metadata = buildMetadata({
  title: "BuiltWithOpenClaw - Curated Directory of OpenClaw Products",
  description:
    "Discover the best products built with OpenClaw. Curated directory of SaaS, tools, plugins, skills, and extensions. Find OpenClaw-powered applications.",
  path: "/",
  keywords: ["OpenClaw", "OpenClaw directory", "OpenClaw products", "AI assistant", "built with OpenClaw"],
});

export default async function HomePage() {
  if (!hasSupabase()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Configure Supabase to see listings.
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();

  // Get featured listings for this week
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const { data: slots } = await supabase
    .from("featured_slots")
    .select("listing_id")
    .eq("week_start_date", weekStartStr)
    .order("slot_number")
    .limit(FEATURED_SLOT_COUNT);

  const featuredIds = (slots ?? [])
    .map((s) => s.listing_id)
    .filter((id): id is string => id != null);

  let featuredListings: Listing[] = [];
  if (featuredIds.length > 0) {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .in("id", featuredIds)
      .eq("status", "published");
    featuredListings = (data ?? []) as Listing[];
  }

  const orderedFeatured = featuredIds
    .map((id) => featuredListings.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => l != null)
    .slice(0, 6);

  const { data: allListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <HomePageClient
        featured={orderedFeatured}
        allListings={allListings ?? []}
      />
    </Suspense>
  );
}
