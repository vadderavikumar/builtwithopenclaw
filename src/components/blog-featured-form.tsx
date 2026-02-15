"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

type WeekAvailability = {
  weekStart: string;
  available: number;
  total: number;
  filled: number;
};

type Props = { className?: string };

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + "T12:00:00");
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return d.toLocaleDateString("en-US", options);
}

export function BlogFeaturedForm({ className }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weeks, setWeeks] = useState<WeekAvailability[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog-featured/availability?weeks=8")
      .then((r) => r.json())
      .then((d) => {
        const list = d.weeks ?? (d.weekStart ? [d] : []);
        setWeeks(list);
        if (list.length > 0 && !selectedWeek) {
          const firstAvailable = list.find((w: WeekAvailability) => w.available > 0);
          if (firstAvailable) setSelectedWeek(firstAvailable.weekStart);
        }
      })
      .catch(() => setWeeks([]));
  }, []);

  const selectedWeekData = weeks.find((w) => w.weekStart === selectedWeek);
  const slotsAvailable = (selectedWeekData?.available ?? 0) > 0;
  const hasAnySlots = weeks.some((w) => w.available > 0);

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedWeek || !slotsAvailable) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const listingUrl = (formData.get("listing_url") as string)?.trim() || null;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/blog-featured/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, listingUrl, weekStart: selectedWeek }),
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
    <form onSubmit={handleCheckout} className={cn("space-y-6", className)}>
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Select week *
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Choose which week you want to be featured. Slots are first-come-first-serve.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {weeks.map((w) => (
            <button
              key={w.weekStart}
              type="button"
              onClick={() => w.available > 0 && setSelectedWeek(w.weekStart)}
              disabled={w.available === 0}
              className={cn(
                "rounded-lg border p-3 text-left text-sm transition-colors",
                selectedWeek === w.weekStart
                  ? "border-primary bg-primary/10 text-primary"
                  : w.available > 0
                    ? "border-border hover:border-primary/50 hover:bg-muted/50"
                    : "border-border opacity-50 cursor-not-allowed"
              )}
            >
              <div className="font-medium truncate">{formatWeekLabel(w.weekStart)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {w.available > 0 ? (
                  <span className="text-green-600 dark:text-green-400">{w.available} available</span>
                ) : (
                  "Sold out"
                )}
              </div>
            </button>
          ))}
        </div>
        {weeks.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">Loading availability...</p>
        )}
      </div>

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
        <label className="block text-sm font-medium mb-2">Listing URL (optional)</label>
        <input
          name="listing_url"
          type="url"
          placeholder="https://builtwithopenclaw.com/directory/your-product"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">If your listing is already approved, paste its URL</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!hasAnySlots && weeks.length > 0 && (
        <p className="text-sm text-muted-foreground rounded-lg border border-border bg-muted/50 p-4">
          No slots available in the next 8 weeks. Check back later.
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={loading || !selectedWeek || !slotsAvailable}
        className="w-full"
      >
        {loading
          ? "Redirecting to checkout..."
          : !hasAnySlots
            ? "Sold out"
            : !selectedWeek
              ? "Select a week"
              : `Pay $29 — Blog featured for week of ${selectedWeek ? formatWeekLabel(selectedWeek) : ""}`}
      </Button>
    </form>
  );
}
