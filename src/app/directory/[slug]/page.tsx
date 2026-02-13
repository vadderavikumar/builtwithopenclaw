import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Shield, Flag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { ClaimForm } from "@/components/claim-form";
import { ReportModal } from "@/components/report-modal";
import { UpvoteButton } from "@/components/upvote-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) return { title: "Listing" };
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("listings")
    .select("name, tagline")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return { title: "Listing" };
  return {
    title: data.name,
    description: data.tagline,
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) {
    return (
      <div className="container px-4 py-8">
        <p className="text-muted-foreground">Configure Supabase to view listings.</p>
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

  return (
    <div className="container px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            {listing.logo_url ? (
              <Image
                src={listing.logo_url}
                alt={listing.name}
                width={96}
                height={96}
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                {listing.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{listing.name}</h1>
              {listing.verified && (
                <span className="rounded bg-green-500/20 px-2 py-0.5 text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-lg text-muted-foreground mt-1">{listing.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="rounded bg-muted px-2 py-0.5 text-sm">{listing.category}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-sm">{listing.pricing_type}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-sm">{listing.hosting_type}</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href={listing.url} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Website
                </Button>
              </a>
              {listing.github_url && (
                <a href={listing.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </a>
              )}
              <UpvoteButton listingId={listing.id} initialCount={count ?? 0} />
            </div>
          </div>
        </div>

        {listing.screenshots && listing.screenshots.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.screenshots.map((url: string, i: number) => (
                <Image
                  key={i}
                  src={url}
                  alt={`Screenshot ${i + 1}`}
                  width={400}
                  height={250}
                  className="rounded-lg border object-cover w-full aspect-video"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 prose prose-zinc dark:prose-invert max-w-none">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <ReactMarkdown>{listing.description}</ReactMarkdown>
        </div>

        {listing.openclaw_proof && (
          <div className="mt-8 p-4 rounded-lg border bg-muted/30">
            <h2 className="text-lg font-semibold mb-2">Built with OpenClaw</h2>
            <ReactMarkdown>{listing.openclaw_proof}</ReactMarkdown>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <ClaimForm listingId={listing.id} />
          <ReportModal listingId={listing.id} listingName={listing.name} />
        </div>
      </div>
    </div>
  );
}
