import Link from "next/link";
import { DirectoryPageClient } from "@/components/directory-page-client";
import { ItemListJsonLd } from "@/components/json-ld";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/metadata";
import { SKILL_SIDEBAR_CATEGORIES } from "@/lib/showcase-data";

export const metadata = buildMetadata({
  title: "OpenClaw Skills",
  description:
    "Discover OpenClaw skills for web automation, development, finance, productivity, and more. AgentSkills and SKILL.md extensions to power your OpenClaw agent.",
  path: "/skills",
  keywords: [
    "OpenClaw skills",
    "OpenClaw AgentSkills",
    "OpenClaw SKILL.md",
    "OpenClaw extensions",
    "OpenClaw web automation",
  ],
});

export default async function SkillsPage({
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
        <div className="text-center text-muted-foreground">Configure Supabase to browse skills.</div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: allListings } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "published")
    .in("product_type", ["Skill", "Extension"])
    .order("published_at", { ascending: false });

  const listings = allListings ?? [];
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            OpenClaw Skills
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Skills give your OpenClaw agent new abilities—web automation, browser control, search, development tools, and more. Browse AgentSkills and SKILL.md extensions from the community.
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
          name="OpenClaw Skills"
          description="Curated list of OpenClaw skills and extensions for web automation, development, and productivity"
        />

        <DirectoryPageClient
          allListings={listings}
          initialCategory={category}
          initialProductType="Skill"
          initialSearch={q}
          basePath="/skills"
          productTypeLock
          productTypes={["Skill", "Extension"]}
          categories={SKILL_SIDEBAR_CATEGORIES}
        />
      </div>
    </div>
  );
}
