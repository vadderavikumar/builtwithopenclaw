"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Report = {
  id: string;
  listing_id: string;
  reason: string;
  details: string | null;
  created_at: string;
  listings: { name: string; slug: string } | null;
};

export function ReportsList({ reports }: { reports: Report[] }) {
  const router = useRouter();

  async function handleDismiss(id: string) {
    await fetch("/api/admin/reports/dismiss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  if (reports.length === 0) {
    return <p className="text-muted-foreground">No pending reports.</p>;
  }

  return (
    <div className="space-y-4">
      {reports.map((r) => (
        <div key={r.id} className="rounded-lg border p-4">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/directory/${r.listings?.slug}`} className="font-semibold hover:underline">
                {r.listings?.name ?? "Unknown"}
              </Link>
              <p className="text-sm text-muted-foreground">{r.reason}</p>
              {r.details && <p className="text-sm mt-1">{r.details}</p>}
            </div>
            <Button size="sm" variant="outline" onClick={() => handleDismiss(r.id)}>
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
