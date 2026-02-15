import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { SendTestDigest } from "@/components/admin/send-test-digest";

export default async function AdminNewsletterPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Newsletter</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .is("unsubscribed_at", null)
    .order("subscribed_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground mt-1">{(subscribers ?? []).length} active subscribers</p>
        </div>
        <SendTestDigest />
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {(subscribers ?? []).map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-4">{s.email}</td>
                <td className="p-4">{s.subscribed_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
