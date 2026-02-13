"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, PRICING_TYPES, HOSTING_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/directory?${next.toString()}`);
  }

  const category = searchParams.get("category") ?? "";
  const pricing = searchParams.get("pricing") ?? "";
  const hosting = searchParams.get("hosting") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const q = searchParams.get("q") ?? "";

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Search</label>
        <input
          type="search"
          placeholder="Search listings..."
          value={q}
          onChange={(e) => updateParam("q", e.target.value || null)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value || null)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Pricing</label>
        <select
          value={pricing}
          onChange={(e) => updateParam("pricing", e.target.value || null)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {PRICING_TYPES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Hosting</label>
        <select
          value={hosting}
          onChange={(e) => updateParam("hosting", e.target.value || null)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {HOSTING_TYPES.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Sort</label>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="featured">Featured first</option>
          <option value="newest">Newest</option>
          <option value="upvotes">Most upvoted</option>
        </select>
      </div>
    </div>
  );
}
