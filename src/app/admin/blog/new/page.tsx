import { BlogEditor } from "@/components/admin/blog-editor";

export default function AdminNewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Blog Post</h1>
      <BlogEditor mode="create" />
    </div>
  );
}
