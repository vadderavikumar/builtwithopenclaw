"use client";

import Link from "next/link";
import {
  Bot,
  Laptop,
  Palette,
  CheckSquare,
  Megaphone,
  BarChart3,
  CircleSlash,
  PenLine,
  Zap,
  ShoppingCart,
  MessageCircle,
  LayoutGrid,
} from "lucide-react";
import type { Listing } from "@/types/database";
import { cn } from "@/lib/utils";

const CARD_COLORS = [
  "bg-[#facc15]",
  "bg-[#2dd4bf]",
  "bg-[#ec4899]",
  "bg-[#2dd4bf]",
  "bg-[#facc15]",
  "bg-[#ec4899]",
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "AI Tools": Bot,
  "Developer Tools": Laptop,
  Design: Palette,
  Productivity: CheckSquare,
  Marketing: Megaphone,
  Analytics: BarChart3,
  "No Code": CircleSlash,
  "Content Creation": PenLine,
  Automation: Zap,
  "E-Commerce": ShoppingCart,
  Communication: MessageCircle,
};

type Props = {
  listing: Listing;
  index: number;
};

export function FeaturedCard({ listing, index }: Props) {
  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
  const Icon = CATEGORY_ICONS[listing.category] ?? LayoutGrid;

  return (
    <Link
      href={`/directory/${listing.slug}`}
      className={cn(
        "block rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg",
        colorClass
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-zinc-900/20 bg-white/20">
          <Icon className="h-6 w-6 text-zinc-900" />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 text-lg">{listing.name}</h3>
          <p className="text-sm text-zinc-900/80 mt-0.5">{listing.category}</p>
        </div>
      </div>
    </Link>
  );
}
