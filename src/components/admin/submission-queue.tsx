"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Submission = {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
};

export function SubmissionQueue({ submissions }: { submissions: Submission[] }) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setApproving(id);
    try {
      const res = await fetch("/api/admin/submissions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) router.refresh();
    } finally {
      setApproving(null);
    }
  }

  async function handleReject(id: string) {
    const notes = prompt("Rejection reason (optional):");
    if (notes === null) return;
    setRejecting(id);
    try {
      const res = await fetch("/api/admin/submissions/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes }),
      });
      if (res.ok) router.refresh();
    } finally {
      setRejecting(null);
    }
  }

  const pending = submissions.filter((s) => s.status === "pending");

  if (pending.length === 0) {
    return (
      <p className="text-muted-foreground">No pending submissions.</p>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map((s) => (
        <div key={s.id} className="rounded-lg border p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{s.name}</h3>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                {s.url}
              </a>
              <p className="text-sm text-muted-foreground mt-1">{s.tagline}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.category} · {s.created_at.slice(0, 10)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApprove(s.id)}
                disabled={!!approving || !!rejecting}
              >
                {approving === s.id ? "..." : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(s.id)}
                disabled={!!approving || !!rejecting}
              >
                {rejecting === s.id ? "..." : "Reject"}
              </Button>
            </div>
          </div>
          <details className="mt-2">
            <summary className="text-sm cursor-pointer">Description</summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
              {s.description}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
}
