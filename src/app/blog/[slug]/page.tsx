import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { buildMetadata } from "@/lib/metadata";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import { AdSlot } from "@/components/ad-slot";
import { BlogFeaturedList } from "@/components/blog-featured-list";
import { ShareButtons } from "@/components/share-buttons";
import { absoluteUrl } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post" };
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const postUrl = absoluteUrl(`/blog/${slug}`);

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
              {post.date && (
                <time className="text-muted-foreground mt-3 block">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </header>

            <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-4">
              <ShareButtons url={postUrl} title={post.title} text={post.description} />
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
    </div>
  );
}
