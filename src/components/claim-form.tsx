"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { listingId: string };

export function ClaimForm({ listingId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading" || status === "success"}
          className={cn(
            "rounded-md border border-input bg-background px-3 py-2 text-sm w-48",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          )}
        />
        <Button
          type="submit"
          size="sm"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Sending..." : status === "success" ? "Check email" : "Claim listing"}
        </Button>
      </form>
      {status === "error" && (
        <span className="text-sm text-destructive">Failed. Try again.</span>
      )}
    </div>
  );
}
