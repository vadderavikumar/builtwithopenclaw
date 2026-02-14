"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/types/database";
import { LogoImage } from "@/components/logo-image";
import { PRODUCT_TYPE_EMOJI } from "@/lib/showcase-data";

interface ProductCardProps {
  product: Listing;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const productType = product.product_type ?? "Application";
  const typeEmoji = PRODUCT_TYPE_EMOJI[productType as keyof typeof PRODUCT_TYPE_EMOJI] ?? "📦";

  const tagline = product.tagline || product.description;
  const tags = [
    productType && `${typeEmoji} ${productType}`,
    product.category,
    product.pricing_type,
    ...(product.tags || []).slice(0, 2),
  ].filter(Boolean);

  return (
    <Link
      href={`/directory/${product.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-muted/50"
    >
      <div className="flex items-start gap-3">
        <LogoImage
          logoUrl={product.logo_url}
          websiteUrl={product.url}
          name={product.name}
          productType={productType}
          size="sm"
          className="h-12 w-12 rounded-md border-0 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tagline}
          </p>
          <h3 className="font-display font-semibold text-foreground mt-1 truncate">
            {product.name}
          </h3>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tags.map((tag) => (
          <span
            key={String(tag)}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
