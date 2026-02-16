import { notFound } from "next/navigation";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { BlogEditor } from "@/components/admin/blog-editor";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditBlogPage({ params }: Props) {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <BlogEditor mode="edit" initialData={post} />
    </div>
  );
}
