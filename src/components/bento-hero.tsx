"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/types/database";
import { LogoImage } from "@/components/logo-image";
import { cn } from "@/lib/utils";

interface BentoHeroProps {
  featured: Listing[];
}

const colorMap: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

export function BentoHero({ featured }: BentoHeroProps) {
  const colors: ("primary" | "secondary" | "accent")[] = ["primary", "secondary", "accent"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {featured.map((product, i) => (
        <Link
          key={product.id}
          href={`/directory/${product.slug}`}
          className={cn(
            "group relative rounded-lg p-4 flex flex-col justify-between min-h-[120px] transition-all hover:scale-[1.02] hover:shadow-lg",
            colorMap[colors[i % 3]]
          )}
        >
          <LogoImage
            logoUrl={product.logo_url}
            websiteUrl={product.url}
            name={product.name}
            productType={product.product_type}
            size="sm"
            className="h-12 w-12 rounded-md border-0 shrink-0"
            cardTint={colors[i % 3]}
          />
          <div className="mt-2">
            <h3 className="font-display text-sm font-bold leading-tight">
              {product.name}
            </h3>
            <span className="text-xs opacity-70 mt-1 block">{product.category}</span>
          </div>
          <ArrowUpRight className="absolute top-3 right-3 h-4 w-4 opacity-0 group-hover:opacity-80 transition-opacity" />
        </Link>
      ))}
    </div>
  );
}
