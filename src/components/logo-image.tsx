"use client";

import { useState } from "react";
import Image from "next/image";
import { getGradientForName } from "@/lib/utils";
import { cn } from "@/lib/utils";

type LogoImageProps = {
  logoUrl: string | null;
  websiteUrl: string;
  name: string;
  productType?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** When in a featured card, use gradient that matches the card background */
  cardTint?: "primary" | "secondary" | "accent";
};

const sizes = {
  sm: { w: 40, h: 40 },
  md: { w: 56, h: 56 },
  lg: { w: 96, h: 96 },
};

/** Gradients that match featured card primary/secondary/accent */
const CARD_GRADIENTS: Record<string, string> = {
  primary: "from-red-700 to-red-900",
  secondary: "from-teal-600 to-cyan-700",
  accent: "from-red-700 to-red-900",
};

/** Gradient placeholder - used when no logo_url or when image fails */
function GradientPlaceholder({
  name,
  size,
  className,
  cardTint,
}: {
  name: string;
  size: "sm" | "md" | "lg";
  className?: string;
  cardTint?: "primary" | "secondary" | "accent";
}) {
  const gradient = cardTint ? CARD_GRADIENTS[cardTint] : getGradientForName(name);
  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center font-semibold text-white shrink-0 bg-gradient-to-br",
        gradient,
        size === "sm" && "w-10 h-10 text-sm",
        size === "md" && "w-14 h-14 text-base",
        size === "lg" && "w-20 h-20 text-xl",
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function LogoImage({
  logoUrl,
  name,
  size = "md",
  className,
  cardTint,
}: LogoImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // If user submitted a logo, use it. Otherwise gradient.
  const hasLogo = logoUrl?.trim();

  if (!hasLogo || imageFailed) {
    return <GradientPlaceholder name={name} size={size} className={className} cardTint={cardTint} />;
  }

  const { w, h } = sizes[size];

  const url = logoUrl!.trim();
  return (
    <Image
      src={url}
      alt={name}
      width={size === "lg" ? 80 : w}
      height={size === "lg" ? 80 : h}
      className={cn(
        "rounded-xl object-cover shrink-0 border-0",
        className
      )}
      onError={() => setImageFailed(true)}
      unoptimized={url.startsWith("http")}
    />
  );
}
