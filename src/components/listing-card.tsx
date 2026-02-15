"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import type { Listing } from "@/types/database";
import { cn } from "@/lib/utils";
import { UpvoteButton } from "./upvote-button";
import { LogoImage } from "./logo-image";
import { OpenClawBadge } from "./openclaw-badge";

type ListingCardProps = {
  listing: Listing;
  featured?: boolean;
  upvoteCount?: number;
  compact?: boolean;
  /** 1000.tools style: logo, name, description only */
  simple?: boolean;
};

export function ListingCard({ listing, featured, upvoteCount = 0, compact, simple }: ListingCardProps) {
  if (simple) {
    return (
      <Link
        href={`/directory/${listing.slug}`}
        className="block rounded-lg bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm transition-all relative"
      >
        {featured && (
          <span className="absolute top-3 right-3 text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
            Ad
          </span>
        )}
        <div className="flex gap-3">
          <div className="shrink-0">
            <LogoImage
              logoUrl={listing.logo_url}
              websiteUrl={listing.url}
              name={listing.name}
              productType={listing.product_type}
              size="sm"
            />
          </div>
          <div className="min-w-0 flex-1 pr-8">
            <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{listing.name}</h3>
            <p className="text-[13px] text-zinc-500 line-clamp-2 mt-0.5">{listing.tagline}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/directory/${listing.slug}`}
      className={cn(
        "group block rounded-xl border bg-card p-4 transition-all duration-200 min-w-0 relative",
        "hover:border-primary/30 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      {featured && (
        <span className="absolute top-3 right-3 rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Ad
        </span>
      )}
      <div className="flex gap-3">
        <div className="shrink-0">
          <LogoImage
            logoUrl={listing.logo_url}
            websiteUrl={listing.url}
            name={listing.name}
            productType={listing.product_type}
            size={compact ? "sm" : "md"}
          />
        </div>
        <div className="min-w-0 flex-1 pr-8">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate text-base">{listing.name}</h3>
              {listing.verified && (
                <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{listing.tagline}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[...new Set([listing.product_type, listing.category, listing.pricing_type, listing.hosting_type])].filter(Boolean).map((tag) => (
              <span key={tag} className="rounded-lg bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <OpenClawBadge compact className="shrink-0" />
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Website
            </a>
            {listing.github_url && (
              <a
                href={listing.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors font-medium"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            <UpvoteButton listingId={listing.id} initialCount={upvoteCount} />
          </div>
        </div>
      </div>
    </Link>
  );
}
