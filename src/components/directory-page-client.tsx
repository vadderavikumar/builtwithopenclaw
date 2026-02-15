"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { SHOWCASE_CATEGORIES, PRODUCT_TYPE_EMOJI } from "@/lib/showcase-data";
import { PRODUCT_TYPES } from "@/lib/utils";
import type { Listing } from "@/types/database";

const INITIAL_PAGE_SIZE = 12;
const LOAD_MORE_COUNT = 12;

interface DirectoryPageClientProps {
  allListings: Listing[];
  initialCategory: string;
  initialProductType: string;
  initialSearch: string;
  /** Base path for URLs (e.g. /plugins, /skills). Defaults to /directory */
  basePath?: string;
  /** When true, hide product type tabs and lock to initialProductType (for /plugins, /skills pages) */
  productTypeLock?: boolean;
  /** Categories for sidebar (default: SHOWCASE_CATEGORIES). Use PLUGIN_CATEGORIES, SKILL_CATEGORIES for dedicated pages */
  categories?: readonly { name: string; emoji: string }[];
  /** When set, filter by product_type in this array (e.g. ["Skill", "Extension"] for skills page) */
  productTypes?: string[];
}

export function DirectoryPageClient({
  allListings,
  initialCategory,
  initialProductType,
  initialSearch,
  basePath = "/directory",
  productTypeLock = false,
  categories,
  productTypes,
}: DirectoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  const filtered = useMemo(() => {
    return allListings.filter((p) => {
      const pt = p.product_type ?? "Application";
      const matchesProductType = productTypes
        ? productTypes.includes(pt)
        : initialProductType === "All" || pt === initialProductType;
      const matchesCategory =
        initialCategory === "All" || p.category === initialCategory;
      const searchLower = initialSearch.toLowerCase();
      const matchesSearch =
        !initialSearch ||
        p.name.toLowerCase().includes(searchLower) ||
        (p.tagline || "").toLowerCase().includes(searchLower) ||
        (p.description || "").toLowerCase().includes(searchLower) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchLower));
      return matchesProductType && matchesCategory && matchesSearch;
    });
  }, [initialCategory, initialProductType, initialSearch, allListings, productTypes]);

  const visibleListings = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const showLoadMore = filtered.length > INITIAL_PAGE_SIZE;

  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [initialCategory, initialProductType, initialSearch]);

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`${basePath}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category !== "All") params.set("category", category);
    else params.delete("category");
    router.replace(`${basePath}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const handleProductTypeSelect = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type !== "All") params.set("type", type);
    else params.delete("type");
    router.replace(`${basePath}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const buildHref = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat !== "All") params.set("category", cat);
    else params.delete("category");
    return `${basePath}${params.toString() ? `?${params}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-4 pb-4">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 shrink-0">
            <CategorySidebar
              selected={initialCategory}
              onSelect={handleCategorySelect}
              categories={categories}
              basePath={basePath}
            />
          </aside>

          <div className="flex-1 space-y-3">
            {/* Product type tabs - hidden when productTypeLock (e.g. on /plugins, /skills) */}
            {!productTypeLock && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {(["All", ...PRODUCT_TYPES] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleProductTypeSelect(type)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      initialProductType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {type === "All" ? "📦 All" : `${PRODUCT_TYPE_EMOJI[type]} ${type}s`}
                  </button>
                ))}
              </div>
            )}

            <SearchAutocomplete
              basePath={basePath}
              value={initialSearch}
              onChange={handleSearchChange}
            />

            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {(categories ?? SHOWCASE_CATEGORIES).map((cat) => (
                <Link
                  key={cat.name}
                  href={buildHref(cat.name)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    initialCategory === cat.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.emoji} {cat.name}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {visibleListings.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-16 text-center text-muted-foreground">
                  No products found. Try a different search or category.
                </div>
              )}
              {showLoadMore && hasMore && (
                <div className="col-span-full pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
                    className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Load more ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
              {showLoadMore && !hasMore && filtered.length > INITIAL_PAGE_SIZE && (
                <p className="col-span-full py-4 text-center text-sm text-muted-foreground">
                  Showing all {filtered.length} listings
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
