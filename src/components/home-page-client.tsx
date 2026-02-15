"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BentoHero } from "@/components/bento-hero";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { LogoImage } from "@/components/logo-image";
import { SHOWCASE_CATEGORIES } from "@/lib/showcase-data";
import type { Listing } from "@/types/database";

interface HomePageClientProps {
  featured: Listing[];
  allListings: Listing[];
  newThisWeek?: Listing[];
  trending?: Listing[];
}

export function HomePageClient({ featured, allListings, newThisWeek = [], trending = [] }: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    return allListings.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory, allListings]);

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
        {featured.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Featured this week
            </h2>
            <BentoHero featured={featured} />
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Featured this week
            </p>
            <h2 className="font-display text-xl font-bold text-foreground">
              Your product can be featured here
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Get homepage spotlight placement for this week and drive more visibility.
            </p>
            <Link
              href="/get-featured"
              className="mt-4 inline-flex rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              Book Featured Slot ($49/wk)
            </Link>
          </div>
        )}

        {/* Trending this week */}
        {trending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Trending this week
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trending.slice(0, 6).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* New this week */}
        {newThisWeek.length > 0 && (
          <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4 -mt-2">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                New this week
              </span>
              <Link
                href="/new"
                className="text-sm font-medium text-primary hover:underline shrink-0"
              >
                View all →
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 scrollbar-thin">
              {newThisWeek.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/directory/${product.slug}`}
                  className="group flex items-center gap-3 shrink-0 rounded-lg border border-border bg-card px-4 py-2.5 transition-all hover:border-primary/30 hover:shadow-sm min-w-0"
                >
                  <LogoImage
                    logoUrl={product.logo_url}
                    websiteUrl={product.url}
                    name={product.name}
                    productType={product.product_type}
                    size="sm"
                    className="h-8 w-8 rounded-md shrink-0"
                  />
                  <span className="font-medium text-sm truncate max-w-[140px] group-hover:text-primary transition-colors">
                    {product.name}
                  </span>
                </Link>
              ))}
            </div>
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
