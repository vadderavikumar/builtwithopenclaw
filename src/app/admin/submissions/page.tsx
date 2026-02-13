import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { SubmissionQueue } from "@/components/admin/submission-queue";

export default async function AdminSubmissionsPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Submissions</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      <SubmissionQueue submissions={submissions ?? []} />
    </div>
  );
}
