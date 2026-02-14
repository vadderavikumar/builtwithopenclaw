import { Suspense } from "react";
import { DirectoryPageClient } from "@/components/directory-page-client";
import { ItemListJsonLd } from "@/components/json-ld";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Directory",
  description:
    "Browse all products built with OpenClaw. Filter by category, product type. Discover SaaS, plugins, skills, and extensions.",
  path: "/directory",
  keywords: ["OpenClaw directory", "OpenClaw products", "browse OpenClaw", "OpenClaw list"],
});

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "All";
  const productType = typeof params.type === "string" ? params.type : "All";
  const q = typeof params.q === "string" ? params.q : "";

  if (!hasSupabase()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Configure Supabase to browse listings.
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();

  const { data: allListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const listings = allListings ?? [];
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";

  return (
    <>
      <ItemListJsonLd
        items={listings.slice(0, 20).map((l) => ({ name: l.name, url: `${base}/directory/${l.slug}` }))}
        name="OpenClaw Products Directory"
        description="Curated list of products built with OpenClaw"
      />
      <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
        <DirectoryPageClient
          allListings={listings}
          initialCategory={category}
          initialProductType={productType}
          initialSearch={q}
        />
      </Suspense>
    </>
  );
}
