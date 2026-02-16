import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import { AdSlot } from "@/components/ad-slot";
import { BlogFeaturedList } from "@/components/blog-featured-list";
import { ShareButtons } from "@/components/share-buttons";
import { absoluteUrl } from "@/lib/metadata";
import { sanitizeBlogHtml } from "@/lib/blog-seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post" };
  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const metadata = buildMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt ?? undefined,
    modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
    canonical: post.canonicalUrl ?? undefined,
    keywords: post.seoKeywords,
    image: post.ogImageUrl ?? post.coverImageUrl ?? undefined,
    noIndex: post.noIndex,
    authors: post.authorName ? [post.authorName] : undefined,
  });

  return {
    ...metadata,
    other: {
      ...(metadata.other ?? {}),
      ...(post.geoRegion ? { "geo.region": post.geoRegion } : {}),
      ...(post.geoPlacename ? { "geo.placename": post.geoPlacename } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const postUrl = absoluteUrl(`/blog/${slug}`);
  const safeHtml = sanitizeBlogHtml(post.contentHtml);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "Article",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    url: post.canonicalUrl ?? postUrl,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: post.authorName || "BuiltWithOpenClaw Team",
    },
    publisher: {
      "@type": "Organization",
      name: "BuiltWithOpenClaw",
      url: absoluteUrl("/"),
    },
    image: post.ogImageUrl ?? post.coverImageUrl ?? undefined,
  };

  const faqSchema = post.faqJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqJsonLd,
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              ← Back to blog
            </Link>

            <header className="mb-10">
              <h1 className="font-display text-4xl font-bold text-foreground tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">By {post.authorName}</p>
              {post.publishedAt && (
                <time className="text-muted-foreground mt-3 block">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              <p className="text-sm text-muted-foreground mt-1">{post.readingTimeMinutes} min read</p>
            </header>

            <div
              className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-4">
              <ShareButtons url={postUrl} title={post.title} text={post.excerpt} />
            </div>
          </article>

          <aside className="lg:w-72 shrink-0 space-y-8">
            <BlogFeaturedList />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sponsored
              </p>
              <AdSlot slot="blog-post-sidebar" size="sidebar" className="w-full" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sponsored
              </p>
              <AdSlot slot="blog-post-inline" size="inline" className="w-full" />
            </div>
          </aside>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
    </div>
  );
}
