/**
 * Seed script - run with: npx tsx scripts/seed.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

const sampleListings = [
  {
    slug: "openclaw-demo-saas",
    name: "OpenClaw Demo SaaS",
    tagline: "A sample SaaS built with OpenClaw",
    description: "This is a demo listing showing how OpenClaw powers modern applications.",
    category: "SaaS",
    tags: ["demo", "saas"],
    pricing_type: "Free",
    hosting_type: "SaaS",
    url: "https://example.com",
    logo_url: null,
    screenshots: [],
    status: "published",
    published_at: new Date().toISOString(),
    verified: false,
  },
  {
    slug: "openclaw-self-hosted-tool",
    name: "OpenClaw Self-Hosted Tool",
    tagline: "Self-hosted automation with OpenClaw",
    description: "Run OpenClaw workflows on your own infrastructure.",
    category: "Self-hosted",
    tags: ["self-hosted", "automation"],
    pricing_type: "OSS",
    hosting_type: "Self-hosted",
    url: "https://example.com",
    logo_url: null,
    screenshots: [],
    status: "published",
    published_at: new Date().toISOString(),
    verified: false,
  },
];

async function seed() {
  for (const l of sampleListings) {
    const { error } = await supabase.from("listings").upsert(l, { onConflict: "slug" });
    if (error) console.error("Error:", error);
    else console.log("Seeded:", l.slug);
  }
  const { data } = await supabase.from("collections").upsert(
    {
      slug: "best-self-hosted",
      title: "Best Self-Hosted",
      description: "Top self-hosted OpenClaw products",
      listing_ids: [],
    },
    { onConflict: "slug" }
  );
  console.log("Seeded collection");
}

seed();
