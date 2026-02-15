"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Review = {
  id: string;
  author_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

interface ListingReviewsProps {
  listingId: string;
}

export function ListingReviews({ listingId }: ListingReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?listingId=${listingId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return null;
  if (reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold text-foreground mb-3">
        Reviews ({reviews.length})
      </h2>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i <= Math.round(avgRating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {avgRating.toFixed(1)} ({reviews.length} reviews)
        </span>
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {r.author_name || "Anonymous"} · {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            {r.comment && (
              <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
