"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { listingId: string; listingName: string };

export function ReportModal({ listingId, listingName }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason, details }),
      });
      if (res.ok) {
        setStatus("success");
        setOpen(false);
        setReason("");
        setDetails("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="gap-1 text-muted-foreground">
        <Flag className="h-4 w-4" />
        Report
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="bg-background rounded-lg border p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-lg mb-4">Report listing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Report &quot;{listingName}&quot; for review.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  )}
                >
                  <option value="">Select...</option>
                  <option value="spam">Spam</option>
                  <option value="inaccurate">Inaccurate information</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Details (optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting..." : "Submit report"}
                </Button>
              </div>
              {status === "error" && (
                <p className="text-sm text-destructive">Something went wrong.</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
