import type { Metadata } from "next";

const SITE_NAME = "BuiltWithOpenClaw";
const DEFAULT_DESCRIPTION =
  "A curated directory of products built with OpenClaw. Discover SaaS, tools, plugins, skills, and extensions. Find the best OpenClaw-powered applications.";

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://builtwithopenclaw.com";
}

export function absoluteUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  canonical?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function buildMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path = "/",
    image,
    imageAlt,
    type = "website",
    noIndex = false,
    canonical,
    keywords,
    publishedTime,
    modifiedTime,
    authors,
  } = options;

  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl("/openclaw-logo.png");
  const siteName = SITE_NAME;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.length ? keywords.join(", ") : undefined,
    authors: authors?.length ? authors.map((a) => ({ name: a })) : undefined,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    alternates: {
      canonical: canonical ?? url,
    },
    openGraph: {
      type,
      siteName,
      title,
      description,
      url,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "geo.region": "US",
      "application-name": SITE_NAME,
    },
  };

  return metadata;
}

export function buildListingMetadata(listing: {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  category: string;
  product_type?: string | null;
  logo_url?: string | null;
  published_at?: string | null;
}): Metadata {
  const description =
    listing.tagline ||
    listing.description?.slice(0, 160) ||
    `${listing.name} - ${listing.category} built with OpenClaw`;
  const keywords = [
    "OpenClaw",
    listing.name,
    listing.category,
    listing.product_type ?? "",
    "AI assistant",
    "directory",
  ].filter(Boolean);

  const image =
    listing.logo_url?.startsWith("http") ? listing.logo_url : listing.logo_url ? absoluteUrl(listing.logo_url) : undefined;

  return buildMetadata({
    title: listing.name,
    description: description.slice(0, 160),
    path: `/directory/${listing.slug}`,
    image,
    imageAlt: `${listing.name} logo`,
    type: "article",
    keywords,
    publishedTime: listing.published_at ?? undefined,
    modifiedTime: listing.published_at ?? undefined,
  });
}
