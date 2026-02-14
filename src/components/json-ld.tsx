import { getBaseUrl } from "@/lib/metadata";
import type { Listing } from "@/types/database";

const SITE_NAME = "BuiltWithOpenClaw";
const DEFAULT_DESCRIPTION =
  "A curated directory of products built with OpenClaw. Discover SaaS, tools, plugins, skills, and extensions.";

export function OrganizationJsonLd() {
  const base = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: base,
    logo: `${base}/openclaw-logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: ["https://openclaw.ai", "https://github.com/openclaw"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const base = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: base,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${base}/directory?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd({ listing }: { listing: Listing }) {
  const base = getBaseUrl();
  const url = `${base}/directory/${listing.slug}`;
  const image = listing.logo_url?.startsWith("http") ? listing.logo_url : listing.logo_url ? `${base}${listing.logo_url}` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: listing.name,
    description: listing.tagline || listing.description?.slice(0, 200),
    url: listing.url,
    applicationCategory: listing.category,
    operatingSystem: "Web",
    offers: listing.pricing_type
      ? { "@type": "Offer", price: "0", priceCurrency: "USD" }
      : undefined,
    ...(image && { image: [image] }),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: base,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: listing.published_at ?? undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ItemListJsonLd({
  items,
  name,
  description,
}: {
  items: { name: string; url: string }[];
  name: string;
  description: string;
}) {
  const base = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: item.name,
        url: item.url.startsWith("http") ? item.url : `${base}${item.url}`,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
