import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { LogoImage } from "@/components/logo-image";
import type { Listing } from "@/types/database";

export async function BlogFeaturedList() {
  if (!hasSupabase()) return null;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const supabase = createAdminClient();
  const { data: slots } = await supabase
    .from("blog_featured_slots")
    .select("listing_id")
    .eq("week_start_date", weekStartStr)
    .not("listing_id", "is", null)
    .order("slot_number");

  const ids = (slots ?? []).map((s) => s.listing_id).filter((id): id is string => id != null);
  if (ids.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
          Featured
        </p>
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-3 text-xs text-muted-foreground">
          No featured products yet this week.
        </div>
        <Link
          href="/blog/get-featured"
          className="mt-2 inline-block text-xs text-primary hover:underline"
        >
          Get featured ($29/wk) →
        </Link>
      </div>
    );
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .in("id", ids)
    .eq("status", "published");

  const ordered = ids
    .map((id) => (listings ?? []).find((l) => l.id === id))
    .filter((l): l is Listing => l != null);

  if (ordered.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
          Featured
        </p>
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-3 text-xs text-muted-foreground">
          No featured products yet this week.
        </div>
        <Link
          href="/blog/get-featured"
          className="mt-2 inline-block text-xs text-primary hover:underline"
        >
          Get featured ($29/wk) →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
        Featured
      </p>
      <div className="space-y-2">
        {ordered.map((l) => (
          <Link
            key={l.id}
            href={`/directory/${l.slug}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30"
          >
            <LogoImage
              logoUrl={l.logo_url}
              websiteUrl={l.url}
              name={l.name}
              productType={l.product_type}
              size="sm"
              className="h-8 w-8 rounded-md shrink-0"
            />
            <span className="font-medium text-sm truncate">{l.name}</span>
          </Link>
        ))}
      </div>
      <Link
        href="/blog/get-featured"
        className="mt-2 inline-block text-xs text-primary hover:underline"
      >
        Get featured ($29/wk) →
      </Link>
    </div>
  );
}
