"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { className?: string; initialAvailable?: number };

export function GetFeaturedForm({ className, initialAvailable }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState<number | null>(initialAvailable ?? null);

  useEffect(() => {
    if (initialAvailable !== undefined) return;
    fetch("/api/featured/availability")
      .then((r) => r.json())
      .then((d) => setAvailable(d.available))
      .catch(() => setAvailable(0));
  }, [initialAvailable]);

  const slotsAvailable = available !== null ? available > 0 : true;

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const listingId = (formData.get("listing_id") as string) || null;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, listingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCheckout} className={cn("space-y-4", className)}>
      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Listing ID (optional)</label>
        <input
          name="listing_id"
          placeholder="If your listing is already approved"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!slotsAvailable && available !== null && (
        <p className="text-sm text-muted-foreground rounded-lg border border-border bg-muted/50 p-4">
          No slots available this week. All 10 featured slots are filled. Check back next week.
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={loading || !slotsAvailable}
        className="w-full"
      >
        {loading ? "Redirecting to checkout..." : !slotsAvailable ? "Sold out this week" : "Pay $49 — Get Featured"}
      </Button>
    </form>
  );
}
