import { MetadataRoute } from "next";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/directory`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/get-featured`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  if (!hasSupabase()) return staticPages;

  const supabase = createAdminClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("slug, published_at")
    .eq("status", "published");
  const { data: collections } = await supabase.from("collections").select("slug");

  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${base}/directory/${l.slug}`,
    lastModified: l.published_at ? new Date(l.published_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionPages: MetadataRoute.Sitemap = (collections ?? []).map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...listingPages, ...collectionPages];
}
