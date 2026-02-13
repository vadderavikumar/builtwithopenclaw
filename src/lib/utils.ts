import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const CATEGORIES = [
  "SaaS",
  "Self-hosted",
  "Tool",
  "Plugin",
  "Template",
  "Integration/Service",
] as const;

export const PRICING_TYPES = ["Free", "Freemium", "Paid", "OSS"] as const;

export const HOSTING_TYPES = ["SaaS", "Self-hosted", "Both"] as const;

export const FEATURED_SLOT_COUNT = 10;
