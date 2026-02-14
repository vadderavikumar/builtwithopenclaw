"use client";

import Link from "next/link";
import { LogoImage } from "@/components/logo-image";
import type { Listing } from "@/types/database";

type Props = {
  listing: Listing;
  index: number;
};

export function ListingRow({ listing, index }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const tags = [...new Set([listing.pricing_type, listing.hosting_type, ...(listing.tags || [])])].filter(Boolean);

  return (
    <Link
      href={`/directory/${listing.slug}`}
      className="flex items-center gap-4 py-4 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
    >
      <span className="w-6 text-xs font-medium text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">{num}</span>
      <div className="shrink-0">
        <LogoImage
          logoUrl={listing.logo_url}
          websiteUrl={listing.url}
          name={listing.name}
          productType={listing.product_type}
          size="sm"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-sm text-zinc-900 dark:text-white">{listing.name}</span>
          <span className="text-zinc-400 dark:text-zinc-500">—</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{listing.category}</span>
        </div>
        {listing.tagline && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">{listing.tagline}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {listing.pricing_type && (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{listing.pricing_type}</span>
        )}
        <div className="flex flex-wrap gap-1.5 justify-end">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-zinc-200/80 dark:bg-zinc-700/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
