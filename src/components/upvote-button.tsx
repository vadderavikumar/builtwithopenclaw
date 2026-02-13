"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type UpvoteButtonProps = {
  listingId: string;
  initialCount: number;
};

export function UpvoteButton({ listingId, initialCount }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpvote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count ?? count + 1);
        setVoted(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleUpvote}
      disabled={voted || loading}
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
        voted && "text-primary"
      )}
    >
      <ThumbsUp className={cn("h-3 w-3", voted && "fill-current")} />
      <span>{count}</span>
    </button>
  );
}
