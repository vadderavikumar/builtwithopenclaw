"use client";

import { useState } from "react";

interface HelpfulFeedbackProps {
  listingId: string;
}

export function HelpfulFeedback({ listingId }: HelpfulFeedbackProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "thanks">("idle");

  async function handleClick(helpful: boolean) {
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, helpful }),
      });
      if (res.ok) setStatus("thanks");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "thanks") {
    return (
      <p className="text-sm text-muted-foreground">Thanks for your feedback!</p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Was this helpful?</span>
      <button
        type="button"
        onClick={() => handleClick(true)}
        disabled={status === "loading"}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => handleClick(false)}
        disabled={status === "loading"}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        No
      </button>
    </div>
  );
}
