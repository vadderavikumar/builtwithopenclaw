"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type BlogEditorInitialData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content_html?: string;
  author_name?: string | null;
  cover_image_url?: string | null;
  status?: "draft" | "published" | "archived";
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  canonical_url?: string | null;
  geo_region?: string | null;
  geo_placename?: string | null;
  schema_type?: string | null;
  faq_jsonld?: unknown | null;
  og_image_url?: string | null;
  noindex?: boolean | null;
};

export function BlogEditor({
  mode,
  initialData,
}: {
  mode: "create" | "edit";
  initialData?: BlogEditorInitialData;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(initialData?.content_html ?? "");
  const [authorName, setAuthorName] = useState(initialData?.author_name ?? "BuiltWithOpenClaw Team");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(initialData?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(initialData?.published_at?.slice(0, 10) ?? "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description ?? "");
  const [seoKeywords, setSeoKeywords] = useState((initialData?.seo_keywords ?? []).join(", "));
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url ?? "");
  const [geoRegion, setGeoRegion] = useState(initialData?.geo_region ?? "");
  const [geoPlacename, setGeoPlacename] = useState(initialData?.geo_placename ?? "");
  const [schemaType, setSchemaType] = useState(initialData?.schema_type ?? "Article");
  const [faqJson, setFaqJson] = useState(
    initialData?.faq_jsonld ? JSON.stringify(initialData.faq_jsonld, null, 2) : ""
  );
  const [ogImageUrl, setOgImageUrl] = useState(initialData?.og_image_url ?? "");
  const [noIndex, setNoIndex] = useState(Boolean(initialData?.noindex));

  const previewTitle = useMemo(() => (seoTitle.trim() || title.trim() || "Untitled"), [seoTitle, title]);
  const previewDescription = useMemo(
    () => (seoDescription.trim() || excerpt.trim() || "No meta description provided."),
    [seoDescription, excerpt]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        title,
        slug,
        excerpt,
        contentHtml,
        authorName,
        coverImageUrl,
        status,
        publishedAt: publishedAt || null,
        seoTitle,
        seoDescription,
        seoKeywords,
        canonicalUrl,
        geoRegion,
        geoPlacename,
        schemaType,
        faqJson,
        ogImageUrl,
        noIndex,
      };

      const endpoint = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Save failed");
        return;
      }

      if (mode === "create" && data?.id) {
        router.push(`/admin/blog/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setError("Unexpected error while saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${initialData.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Delete failed");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Unexpected error while deleting");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Content</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Title
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Slug
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
        </div>
        <label className="text-sm block">
          Excerpt
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="text-sm block">
          HTML Editor
          <textarea
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            rows={16}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs"
            placeholder="<h2>Section title</h2><p>Write content here...</p>"
          />
        </label>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Publishing</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Author
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="text-sm">
            Publish Date
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Cover Image URL
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">SEO / GEO / AEO</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            SEO Title
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Canonical URL
            <input
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
        </div>
        <label className="text-sm block">
          SEO Description
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            SEO Keywords (comma separated)
            <input
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            OG Image URL
            <input
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            GEO Region
            <input
              value={geoRegion}
              onChange={(e) => setGeoRegion(e.target.value)}
              placeholder="US-CA"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            GEO Place Name
            <input
              value={geoPlacename}
              onChange={(e) => setGeoPlacename(e.target.value)}
              placeholder="San Francisco"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm">
            JSON-LD Schema Type
            <input
              value={schemaType}
              onChange={(e) => setSchemaType(e.target.value)}
              placeholder="Article"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm flex items-end gap-2">
            <input type="checkbox" checked={noIndex} onChange={(e) => setNoIndex(e.target.checked)} />
            Mark post as noindex
          </label>
        </div>
        <label className="text-sm block">
          FAQ JSON-LD (optional, raw JSON)
          <textarea
            value={faqJson}
            onChange={(e) => setFaqJson(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs"
          />
        </label>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">SERP Preview</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{previewTitle}</p>
        <p className="text-xs text-green-700 dark:text-green-400 truncate">{canonicalUrl || "https://builtwithopenclaw.com/blog/..."}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{previewDescription}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")} disabled={saving}>
          Back
        </Button>
        {mode === "edit" && (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
