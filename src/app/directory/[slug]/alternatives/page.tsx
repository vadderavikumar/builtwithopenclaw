import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Globe } from "lucide-react";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { LogoImage } from "@/components/logo-image";
import { buildMetadata } from "@/lib/metadata";
import type { Listing } from "@/types/database";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!hasSupabase()) return { title: "Alternatives" };
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("listings")
    .select("name")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return { title: "Alternatives" };
  return buildMetadata({
    title: `Alternatives to ${data.name}`,
    description: `Discover alternatives to ${data.name} in the OpenClaw ecosystem. Compare similar products.`,
    path: `/directory/${slug}/alternatives`,
    keywords: [`${data.name} alternatives`, "OpenClaw", "compare"],
  });
}

export default async function AlternativesPage({ params }: Props) {
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

  const { data: alternatives } = await supabase
    .from("listings")
    .select("*")
    .eq("category", listing.category)
    .eq("status", "published")
    .neq("id", listing.id)
    .limit(10);

  const productType = listing.product_type ?? "Application";
  const filtered = (alternatives ?? []).filter(
    (a) => (a.product_type ?? "Application") === productType
  );
  const altListings = filtered.length > 0 ? filtered : (alternatives ?? []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={`/directory/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {listing.name}
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Alternatives to {listing.name}
        </h1>
        <p className="text-muted-foreground mb-8">
          Similar {productType}s in {listing.category}. Compare and find the right fit.
        </p>

        {altListings.length > 0 ? (
          <div className="space-y-2">
            {altListings.map((r) => (
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
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-lg bg-btn-coral px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition-colors shrink-0"
                >
                  <Globe className="h-4 w-4" />
                  Visit
                </a>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            <p>No alternatives found yet. Check back as we add more products.</p>
            <Link href="/directory" className="text-primary hover:underline mt-2 inline-block">
              Browse all listings →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
