import Link from "next/link";
import { DirectoryPageClient } from "@/components/directory-page-client";
import { ItemListJsonLd } from "@/components/json-ld";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/metadata";
import { PLUGIN_SIDEBAR_CATEGORIES } from "@/lib/showcase-data";

export const metadata = buildMetadata({
  title: "OpenClaw Plugins",
  description:
    "Discover OpenClaw plugins for voice, messaging, memory, OAuth, integration, and workflow. Extend your OpenClaw agent with official and community plugins.",
  path: "/plugins",
  keywords: [
    "OpenClaw plugins",
    "OpenClaw plugin directory",
    "OpenClaw voice plugin",
    "OpenClaw integration",
    "OpenClaw extensions",
  ],
});

export default async function PluginsPage({
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
        <div className="text-center text-muted-foreground">Configure Supabase to browse plugins.</div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: allListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .eq("product_type", "Plugin")
    .order("published_at", { ascending: false });

  const listings = allListings ?? [];
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            OpenClaw Plugins
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Plugins extend OpenClaw with new capabilities—voice calls, messaging platforms, OAuth, memory systems, and workflow automation. Browse official and community plugins to enhance your AI assistant.
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
          name="OpenClaw Plugins"
          description="Curated list of OpenClaw plugins for voice, messaging, memory, OAuth, and integrations"
        />

        <DirectoryPageClient
          allListings={listings}
          initialCategory={category}
          initialProductType="Plugin"
          initialSearch={q}
          basePath="/plugins"
          productTypeLock
          categories={PLUGIN_SIDEBAR_CATEGORIES}
        />
      </div>
    </div>
  );
}
