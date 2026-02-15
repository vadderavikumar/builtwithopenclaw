import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export default async function AdminPaymentsPage() {
  if (!hasSupabase()) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Requested week</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Paid at</th>
            </tr>
          </thead>
          <tbody>
            {(purchases ?? []).map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-4">{p.email}</td>
                <td className="p-4">
                  <span className={p.product_type === "blog" ? "text-primary font-medium" : ""}>
                    {p.product_type === "blog" ? "Blog ($29)" : "Homepage ($49)"}
                  </span>
                </td>
                <td className="p-4">
                  {p.requested_week_start ? (
                    <span className="font-medium">{p.requested_week_start}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-4">${(p.amount / 100).toFixed(2)}</td>
                <td className="p-4">{p.status}</td>
                <td className="p-4">{p.created_at.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
