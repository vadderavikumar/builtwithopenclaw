"use client";

interface AdSlotProps {
  /** Slot identifier for ad networks (e.g. "blog-sidebar", "blog-inline") */
  slot?: string;
  /** Size hint: "sidebar" (300x250), "banner" (728x90), "inline" (336x280) */
  size?: "sidebar" | "banner" | "inline";
  className?: string;
}

const sizeMap = {
  sidebar: "min-h-[250px] min-w-[300px]",
  banner: "min-h-[90px] min-w-[728px] max-w-full",
  inline: "min-h-[280px] min-w-[336px]",
};

export function AdSlot({ slot = "default", size = "sidebar", className }: AdSlotProps) {
  return (
    <div
      className={`rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center ${sizeMap[size]} ${className ?? ""}`}
      data-ad-slot={slot}
    >
      <span className="text-xs text-muted-foreground">Ad space</span>
    </div>
  );
}
