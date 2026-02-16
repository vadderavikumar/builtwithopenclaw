import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import {
  estimateReadingTimeMinutes,
  normalizeKeywords,
  safeParseFaqJson,
  sanitizeBlogHtml,
} from "@/lib/blog-seo";

type BlogPostPayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  authorName?: string;
  coverImageUrl?: string;
  status?: "draft" | "published" | "archived";
  publishedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  geoRegion?: string;
  geoPlacename?: string;
  schemaType?: string;
  faqJson?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
};

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as BlogPostPayload;
    const title = (body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

    const supabase = createAdminClient();
    const desiredSlug = slugify((body.slug ?? "").trim() || title);

    const { data: duplicate } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", desiredSlug)
      .neq("id", id)
      .maybeSingle();

    if (duplicate) {
      return NextResponse.json({ error: "Slug already exists. Choose a different slug." }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id, status, published_at")
      .eq("id", id)
      .maybeSingle();

    if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const contentHtml = sanitizeBlogHtml(body.contentHtml ?? "");
    const status = body.status ?? "draft";
    const publishedAt =
      status === "published"
        ? (body.publishedAt
            ? new Date(body.publishedAt).toISOString()
            : existing.published_at ?? new Date().toISOString())
        : null;

    const { error } = await supabase
      .from("blog_posts")
      .update({
        slug: desiredSlug,
        title,
        excerpt: (body.excerpt ?? "").trim(),
        content_html: contentHtml,
        author_name: (body.authorName ?? "").trim() || "BuiltWithOpenClaw Team",
        cover_image_url: (body.coverImageUrl ?? "").trim() || null,
        status,
        published_at: publishedAt,
        seo_title: (body.seoTitle ?? "").trim() || null,
        seo_description: (body.seoDescription ?? "").trim() || null,
        seo_keywords: normalizeKeywords(body.seoKeywords ?? ""),
        canonical_url: (body.canonicalUrl ?? "").trim() || null,
        geo_region: (body.geoRegion ?? "").trim() || null,
        geo_placename: (body.geoPlacename ?? "").trim() || null,
        schema_type: (body.schemaType ?? "").trim() || "Article",
        faq_jsonld: safeParseFaqJson(body.faqJson ?? ""),
        og_image_url: (body.ogImageUrl ?? "").trim() || null,
        noindex: Boolean(body.noIndex),
        reading_time_minutes: estimateReadingTimeMinutes(contentHtml),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
