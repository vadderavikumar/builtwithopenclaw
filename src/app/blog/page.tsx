import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getAllBlogPosts } from "@/lib/blog";
import { AdSlot } from "@/components/ad-slot";
import { BlogFeaturedList } from "@/components/blog-featured-list";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Tips, guides, and updates about the OpenClaw ecosystem. Learn how to get the most from BuiltWithOpenClaw.",
  path: "/blog",
  keywords: ["OpenClaw blog", "OpenClaw tips", "BuiltWithOpenClaw"],
});

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0">
            <div className="mb-10">
              <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
                Blog
              </h1>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                Tips, guides, and updates about the OpenClaw ecosystem.
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.publishedAt && (
                      <time className="text-sm text-muted-foreground mt-1 block">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                    {post.excerpt && (
                      <p className="text-muted-foreground mt-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="inline-block mt-3 text-sm font-medium text-primary group-hover:underline">
                      Read more →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No posts yet. Check back soon!</p>
              </div>
            )}
          </main>

          <aside className="lg:w-72 shrink-0 space-y-6">
            <BlogFeaturedList />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sponsored
              </p>
              <AdSlot slot="blog-sidebar" size="sidebar" className="w-full" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
