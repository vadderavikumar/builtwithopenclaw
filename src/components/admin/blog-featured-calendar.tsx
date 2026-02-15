"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Listing = { id: string; name: string; slug: string };
type Purchase = { id: string; email: string; requested_week_start: string | null; listing_id: string | null; created_at: string };
type SlotAssignment = { week_start_date: string; slot_number: number; listing_id: string | null };

function getWeekStart(d: Date): string {
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + offset);
  return monday.toISOString().split("T")[0];
}

export function BlogFeaturedCalendar({
  listings,
  purchases = [],
  slotAssignments = [],
}: {
  listings: Listing[];
  purchases?: Purchase[];
  slotAssignments?: SlotAssignment[];
}) {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pendingForWeek = purchases.filter((p) => p.requested_week_start === weekStart);
  const assignedForWeek = slotAssignments.filter(
    (s) => s.week_start_date === weekStart && s.listing_id
  );
  const assignedBySlot = new Map(
    assignedForWeek.map((s) => [s.slot_number, s.listing_id as string])
  );

  async function handleAssign(slotNumber: number, listingId: string | null) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog-featured/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart, slotNumber, listingId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to update blog featured slot.");
      }
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
            {pendingForWeek.length} paid for blog featured this week
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

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((slotNum) => (
          <div key={slotNum} className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-2">Slot {slotNum}</p>
            {assignedBySlot.get(slotNum) && (
              <p className="text-xs text-muted-foreground mb-2 truncate">
                Current: {listings.find((l) => l.id === assignedBySlot.get(slotNum))?.name ?? "Assigned"}
              </p>
            )}
            <select
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              value={assignedBySlot.get(slotNum) ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                if (id === "" && assignedBySlot.get(slotNum)) {
                  handleAssign(slotNum, null);
                  return;
                }
                if (id === "__clear__") {
                  handleAssign(slotNum, null);
                  return;
                }
                if (id && id !== assignedBySlot.get(slotNum)) handleAssign(slotNum, id);
              }}
              disabled={loading}
            >
              <option value="">{assignedBySlot.get(slotNum) ? "Unassigned" : "Assign..."}</option>
              {assignedBySlot.get(slotNum) && <option value="__clear__">Clear assignment</option>}
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
