import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, ThumbsUp } from "lucide-react";
import type { Listing } from "@/types/database";
import { cn } from "@/lib/utils";
import { UpvoteButton } from "./upvote-button";

type ListingCardProps = {
  listing: Listing;
  featured?: boolean;
  upvoteCount?: number;
  compact?: boolean;
};

export function ListingCard({ listing, featured, upvoteCount = 0, compact }: ListingCardProps) {
  return (
    <Link
      href={`/directory/${listing.slug}`}
      className={cn(
        "group block rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md",
        featured && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          {listing.logo_url ? (
            <Image
              src={listing.logo_url}
              alt={listing.name}
              width={compact ? 40 : 48}
              height={compact ? 40 : 48}
              className="rounded-lg object-cover"
            />
          ) : (
            <div
              className={cn(
                "rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground",
                compact ? "w-10 h-10 text-sm" : "w-12 h-12"
              )}
            >
              {listing.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{listing.name}</h3>
                {featured && (
                  <span className="shrink-0 rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary">
                    Featured
                  </span>
                )}
                {listing.verified && (
                  <span className="shrink-0 rounded bg-green-500/20 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{listing.tagline}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{listing.category}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{listing.pricing_type}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{listing.hosting_type}</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Website
            </a>
            {listing.github_url && (
              <a
                href={listing.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Github className="h-3 w-3" />
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
