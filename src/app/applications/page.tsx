import Link from "next/link";
import { DirectoryPageClient } from "@/components/directory-page-client";
import { ItemListJsonLd } from "@/components/json-ld";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/metadata";
import { APP_SIDEBAR_CATEGORIES } from "@/lib/showcase-data";

export const metadata = buildMetadata({
  title: "OpenClaw Applications",
  description:
    "Discover OpenClaw applications—SaaS, desktop apps, hosting, and tools built with OpenClaw. Find AI assistants, productivity tools, and more.",
  path: "/applications",
  keywords: [
    "OpenClaw applications",
    "OpenClaw SaaS",
    "OpenClaw apps",
    "OpenClaw hosting",
    "built with OpenClaw",
  ],
});

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "All";
  const q = typeof params.q === "string" ? params.q : "";

  if (!hasSupabase()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Configure Supabase to browse applications.</div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: allListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .eq("product_type", "Application")
    .order("published_at", { ascending: false });

  const listings = allListings ?? [];
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            OpenClaw Applications
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Applications built with OpenClaw—SaaS products, desktop apps, hosting services, and tools. Deploy your own instance, use hosted AI assistants, or integrate OpenClaw into your workflow.
          </p>
          <Link
            href="/directory"
            className="inline-block mt-4 text-sm text-primary hover:underline"
          >
            View all product types →
          </Link>
        </div>

        <ItemListJsonLd
          items={listings.slice(0, 20).map((l) => ({ name: l.name, url: `${base}/directory/${l.slug}` }))}
          name="OpenClaw Applications"
          description="Curated list of OpenClaw applications including SaaS, hosting, and desktop apps"
        />

        <DirectoryPageClient
          allListings={listings}
          initialCategory={category}
          initialProductType="Application"
          initialSearch={q}
          basePath="/applications"
          productTypeLock
          categories={APP_SIDEBAR_CATEGORIES}
        />
      </div>
    </div>
  );
}
