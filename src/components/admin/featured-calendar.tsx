"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Listing = { id: string; name: string; slug: string };
type Purchase = { id: string; email: string; requested_week_start: string | null; listing_id: string | null; created_at: string };

function getWeekStart(d: Date): string {
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + offset);
  return monday.toISOString().split("T")[0];
}

export function FeaturedCalendar({ listings, purchases = [] }: { listings: Listing[]; purchases?: Purchase[] }) {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [loading, setLoading] = useState(false);

  const pendingForWeek = purchases.filter((p) => p.requested_week_start === weekStart);

  async function handleAssign(slotNumber: number, listingId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/featured/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart, slotNumber, listingId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Week starting</label>
        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {pendingForWeek.length > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium mb-2">
            {pendingForWeek.length} paid for this week
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {pendingForWeek.map((p) => {
              const listing = p.listing_id ? listings.find((l) => l.id === p.listing_id) : null;
              return (
                <li key={p.id}>
                  {p.email}
                  {listing && ` • ${listing.name}`}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slotNum) => (
          <div key={slotNum} className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-2">Slot {slotNum}</p>
            <select
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              onChange={(e) => {
                const id = e.target.value;
                if (id) handleAssign(slotNum, id);
              }}
              disabled={loading}
            >
              <option value="">Assign...</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
