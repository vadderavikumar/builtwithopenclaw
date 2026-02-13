import Link from "next/link";
import { Search, PlusCircle, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { FeaturedSection } from "@/components/featured-section";
import { NewlyAddedSection } from "@/components/newly-added-section";

export default async function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              The database of products built with OpenClaw
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover curated SaaS, tools, plugins, and integrations. Submit your product for free
              or get featured for maximum visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/directory">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Search className="h-4 w-4" />
                  Browse Directory
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Submit Listing
                </Button>
              </Link>
              <Link href="/get-featured">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                  <Star className="h-4 w-4" />
                  Get Featured
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured this week */}
      <FeaturedSection />

      {/* Newly added */}
      <NewlyAddedSection />

      {/* Categories preview */}
      <section className="border-b py-16">
        <div className="container px-4">
          <h2 className="text-2xl font-semibold mb-6">Browse by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["SaaS", "Self-hosted", "Tool", "Plugin", "Template", "Integration/Service"].map(
              (cat) => (
                <Link
                  key={cat}
                  href={`/directory?category=${encodeURIComponent(cat)}`}
                  className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium">{cat}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to get your product in front of builders?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Submit your listing for free (manual review within 48h) or get a featured slot for $49/week.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/submit">
              <Button size="lg">Submit for Free</Button>
            </Link>
            <Link href="/get-featured">
              <Button variant="outline" size="lg">Get Featured</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
