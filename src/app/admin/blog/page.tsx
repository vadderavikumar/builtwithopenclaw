import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";

export default async function AdminBlogPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-1">Manage blog posts with SEO/GEO/AEO metadata and HTML content.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">New Post</Link>
        </Button>
      </div>

      {(posts ?? []).length === 0 ? (
        <div className="rounded-lg border p-6 text-muted-foreground">No posts yet.</div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Published</th>
                <th className="text-left p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {(posts ?? []).map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="p-3">
                    <Link href={`/admin/blog/${post.id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{post.slug}</td>
                  <td className="p-3">{post.status}</td>
                  <td className="p-3 text-muted-foreground">{post.published_at?.slice(0, 10) ?? "-"}</td>
                  <td className="p-3 text-muted-foreground">{post.updated_at?.slice(0, 10) ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
