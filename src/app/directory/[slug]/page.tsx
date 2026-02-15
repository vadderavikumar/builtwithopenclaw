import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { LogoImage } from "@/components/logo-image";
import { ClaimForm } from "@/components/claim-form";
import { ReportModal } from "@/components/report-modal";
import { UpvoteButton } from "@/components/upvote-button";
import { ShareButtons } from "@/components/share-buttons";
import { CopyLinkButton } from "@/components/copy-link-button";
import { OpenClawBadge } from "@/components/openclaw-badge";
import { ListingReviews } from "@/components/listing-reviews";
import { ReviewForm } from "@/components/review-form";
import { HelpfulFeedback } from "@/components/helpful-feedback";
import { SoftwareApplicationJsonLd } from "@/components/json-ld";
import { buildListingMetadata, absoluteUrl } from "@/lib/metadata";
import type { Listing } from "@/types/database";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) return { title: "Listing" };
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("listings")
    .select("name, tagline, description, slug, category, product_type, logo_url, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return { title: "Listing" };
  return buildListingMetadata(data as Listing);
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Configure Supabase to view listings.
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !listing) notFound();

  const { count } = await supabase
    .from("listing_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listing.id);

  const tags = [listing.pricing_type, listing.hosting_type, ...(listing.tags || [])].filter(Boolean);

  const { data: categoryListings } = await supabase
    .from("listings")
    .select("*")
    .eq("category", listing.category)
    .eq("status", "published")
    .neq("id", listing.id)
    .limit(12);

  const listingTags = new Set(listing.tags ?? []);
  const related = (categoryListings ?? [])
    .sort((a, b) => {
      const aOverlap = (a.tags ?? []).filter((t: string) => listingTags.has(t)).length;
      const bOverlap = (b.tags ?? []).filter((t: string) => listingTags.has(t)).length;
      return bOverlap - aOverlap;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <SoftwareApplicationJsonLd listing={listing as Listing} />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to directory
        </Link>

        {/* Product header */}
        <div className="flex items-start gap-6 mb-8">
          <LogoImage
            logoUrl={listing.logo_url}
            websiteUrl={listing.url}
            name={listing.name}
            productType={listing.product_type}
            size="lg"
          />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-foreground">{listing.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-muted-foreground">{listing.category}</span>
              {listing.product_type && (
                <span className="rounded-full border border-border px-3 py-0.5 text-sm font-medium text-muted-foreground">
                  {listing.product_type}
                </span>
              )}
            </div>
          </div>
          <a
            href={listing.url}
            className="flex items-center gap-2 rounded-lg bg-btn-coral px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-colors shrink-0"
          >
            <Globe className="h-4 w-4" />
            Visit
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Last updated */}
        {(listing.updated_at || listing.published_at) && (
          <p className="text-sm text-muted-foreground mb-4">
            Last updated:{" "}
            {new Date(listing.updated_at ?? listing.published_at ?? "").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Tags & pricing */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <OpenClawBadge />
          {listing.pricing_type && (
            <span className="rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              {listing.pricing_type}
            </span>
          )}
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description - exact from ProductDetail.tsx */}
        <div className="rounded-xl border border-border bg-card p-8 mb-10">
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">About</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            <ReactMarkdown>{listing.description}</ReactMarkdown>
          </div>
          {listing.openclaw_proof && (
            <div className="mt-4">
              <ReactMarkdown>{listing.openclaw_proof}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mb-10 space-y-6">
          <ListingReviews listingId={listing.id} />
          <ReviewForm listingId={listing.id} />
        </div>

        {/* Alternatives link */}
        <div className="mb-6">
          <Link
            href={`/directory/${listing.slug}/alternatives`}
            className="text-sm font-medium text-primary hover:underline"
          >
            See alternatives to {listing.name} →
          </Link>
        </div>

        {/* Similar products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Similar products
            </h2>
            <div className="space-y-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/directory/${r.slug}`}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/30 hover:bg-muted/50 transition-all group"
                >
                  <LogoImage
                    logoUrl={r.logo_url}
                    websiteUrl={r.url}
                    name={r.name}
                    productType={r.product_type}
                    size="sm"
                    className="h-10 w-10 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{r.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{r.tagline || r.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <HelpfulFeedback listingId={listing.id} />
          <UpvoteButton listingId={listing.id} initialCount={count ?? 0} />
          <ShareButtons
            url={absoluteUrl(`/directory/${listing.slug}`)}
            title={`${listing.name} - Built with OpenClaw`}
            text={listing.tagline}
          />
          <CopyLinkButton url={absoluteUrl(`/directory/${listing.slug}`)} />
          <ClaimForm listingId={listing.id} />
          <ReportModal listingId={listing.id} listingName={listing.name} />
        </div>
      </div>
    </div>
  );
}
