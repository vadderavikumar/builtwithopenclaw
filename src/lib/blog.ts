import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  authorName: string;
  coverImageUrl: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  updatedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  canonicalUrl: string | null;
  geoRegion: string | null;
  geoPlacename: string | null;
  schemaType: string;
  faqJsonLd: unknown | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  readingTimeMinutes: number;
};

function mapDbPost(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    contentHtml: String(row.content_html ?? ""),
    authorName: String(row.author_name ?? "BuiltWithOpenClaw Team"),
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : null,
    status: (row.status as BlogPost["status"]) ?? "draft",
    publishedAt: row.published_at ? String(row.published_at) : null,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    seoKeywords: Array.isArray(row.seo_keywords) ? (row.seo_keywords as string[]) : [],
    canonicalUrl: row.canonical_url ? String(row.canonical_url) : null,
    geoRegion: row.geo_region ? String(row.geo_region) : null,
    geoPlacename: row.geo_placename ? String(row.geo_placename) : null,
    schemaType: String(row.schema_type ?? "Article"),
    faqJsonLd: row.faq_jsonld ?? null,
    ogImageUrl: row.og_image_url ? String(row.og_image_url) : null,
    noIndex: Boolean(row.noindex),
    readingTimeMinutes: Number(row.reading_time_minutes ?? 1),
  };
}

function getLegacyBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function getLegacyBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const publishedAt = data.date ? String(data.date) : null;

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.description ?? "",
    contentHtml: `<p>${content.replace(/\n\n/g, "</p><p>")}</p>`,
    authorName: "BuiltWithOpenClaw Team",
    coverImageUrl: null,
    status: "published",
    publishedAt,
    updatedAt: publishedAt,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: [],
    canonicalUrl: null,
    geoRegion: null,
    geoPlacename: null,
    schemaType: "Article",
    faqJsonLd: null,
    ogImageUrl: null,
    noIndex: false,
    readingTimeMinutes: 1,
  };
}

export async function getBlogSlugs(): Promise<string[]> {
  if (!hasSupabase()) return getLegacyBlogSlugs();

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (data ?? []).map((row) => String(row.slug));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!hasSupabase()) return getLegacyBlogPost(slug);

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return null;
  return mapDbPost(data as Record<string, unknown>);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!hasSupabase()) {
    const posts = getLegacyBlogSlugs()
      .map((slug) => getLegacyBlogPost(slug))
      .filter((post): post is BlogPost => post != null);

    return posts.sort((a, b) => (b.publishedAt ?? "") > (a.publishedAt ?? "") ? 1 : -1);
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (data ?? []).map((row) => mapDbPost(row as Record<string, unknown>));
}
