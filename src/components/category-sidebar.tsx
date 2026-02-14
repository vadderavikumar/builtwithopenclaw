"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SHOWCASE_CATEGORIES } from "@/lib/showcase-data";

type CategoryItem = { name: string; emoji: string };

interface CategorySidebarProps {
  selected?: string;
  onSelect?: (category: string) => void;
  categories?: readonly CategoryItem[];
  basePath?: string;
}

export function CategorySidebar({
  selected: controlledSelected,
  onSelect,
  categories = SHOWCASE_CATEGORIES,
  basePath = "/directory",
}: CategorySidebarProps) {
  const searchParams = useSearchParams();
  const urlSelected = searchParams.get("category") ?? "All";
  const selected = controlledSelected ?? urlSelected;
  const isControlled = onSelect !== undefined;
  const cats = [...categories];

  return (
    <nav className="space-y-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Category</p>
        <div className="space-y-1">
      {cats.map((cat) => {
        if (isControlled) {
          return (
            <button
              key={cat.name}
              onClick={() => onSelect!(cat.name)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                selected === cat.name
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        }

        const params = new URLSearchParams(searchParams.toString());
        if (cat.name === "All") params.delete("category");
        else params.set("category", cat.name);
        const href = `${basePath}${params.toString() ? `?${params}` : ""}`;
        const isSelected = selected === cat.name;

        return (
          <Link
            key={cat.name}
            href={href}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
              isSelected
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="text-lg">{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        );
      })}
        </div>
      </div>
    </nav>
  );
}
