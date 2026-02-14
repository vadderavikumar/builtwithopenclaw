"use client";

import { useMemo, useState } from "react";
import { BentoHero } from "@/components/bento-hero";
import { SearchBar } from "@/components/search-bar";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { SHOWCASE_CATEGORIES } from "@/lib/showcase-data";
import type { Listing } from "@/types/database";

interface HomePageClientProps {
  featured: Listing[];
  allListings: Listing[];
}

export function HomePageClient({ featured, allListings }: HomePageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    return allListings.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(searchLower) ||
        (p.tagline || "").toLowerCase().includes(searchLower) ||
        (p.description || "").toLowerCase().includes(searchLower) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchLower));
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, allListings]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 -mt-3 pt-0 pb-4">
        {/* Hero tagline */}
        <div className="pt-4 mb-4">
          <h1 className="font-display text-4xl font-bold text-foreground">
            An exclusive list of products built with{" "}
            <span className="text-gradient-brand">OpenClaw</span>
          </h1>
        </div>

        {/* Featured this week */}
        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Featured this week
            </h2>
            <BentoHero featured={featured} />
          </div>
        )}

        {/* Main content - exact from Index.tsx */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} />
          </aside>

          {/* Product list */}
          <div className="flex-1 space-y-3">
            <SearchBar value={search} onChange={setSearch} />

            {/* Mobile category pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
              {SHOWCASE_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground">
                  No products found. Try a different search or category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
