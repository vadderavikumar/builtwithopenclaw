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

export const PRODUCT_TYPES = ["Application", "Plugin", "Skill", "Extension"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

/** Categories for Applications (web apps, SaaS, desktop, hosting) */
export const APP_CATEGORIES = [
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Marketing",
  "Analytics",
  "No Code",
  "Content Creation",
  "Automation",
  "E-Commerce",
  "Communication",
  "SaaS",
  "Self-hosted",
  "Tool",
  "Template",
  "Integration/Service",
  "Hosting",
  "Desktop App",
] as const;

/** Categories for Plugins (npm packages, extensions) */
export const PLUGIN_CATEGORIES = [
  "Voice/Call",
  "Messaging",
  "Memory",
  "OAuth",
  "Integration",
  "Workflow",
] as const;

/** Categories for Skills (AgentSkills, SKILL.md) */
export const SKILL_CATEGORIES = [
  "Web Automation",
  "Communication",
  "Development",
  "Finance",
  "Media & UI",
  "Network",
  "News & Info",
  "Productivity",
  "Runtime & OS",
  "Security",
  "Utilities",
] as const;

/** All categories combined for directory filters (deduped) */
export const CATEGORIES = Array.from(
  new Set([...APP_CATEGORIES, ...PLUGIN_CATEGORIES, ...SKILL_CATEGORIES])
) as readonly string[];

export const SIDEBAR_CATEGORIES = [
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Marketing",
  "Analytics",
  "No Code",
  "Content Creation",
  "Automation",
  "E-Commerce",
  "Communication",
] as const;

export function getCategoriesForProductType(productType: ProductType): readonly string[] {
  switch (productType) {
    case "Application":
      return APP_CATEGORIES;
    case "Plugin":
      return PLUGIN_CATEGORIES;
    case "Skill":
    case "Extension":
      return SKILL_CATEGORIES;
    default:
      return APP_CATEGORIES;
  }
}

export const PRICING_TYPES = ["Free", "Freemium", "Paid", "OSS"] as const;

export const HOSTING_TYPES = ["SaaS", "Self-hosted", "Both"] as const;

export const FEATURED_SLOT_COUNT = 10;

/** Extract hostname from URL for logo/favicon fetching */
export function getDomainFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** Google favicon API - works for any domain */
export function getFaviconUrl(url: string, size = 128): string {
  const domain = getDomainFromUrl(url);
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/** Apistemic logos API - free Clearbit alternative, no API key required */
export function getLogoApiUrl(url: string): string {
  const domain = getDomainFromUrl(url);
  if (!domain) return "";
  return `https://logos-api.apistemic.com/domain:${domain}`;
}

/** DuckDuckGo favicon - often more reliable than Google for many domains */
export function getDuckDuckGoFaviconUrl(url: string): string {
  const domain = getDomainFromUrl(url);
  if (!domain) return "";
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

/** Gradient colors for non-Application types (Plugin, Skill, Extension) - consistent from name */
export const PLACEHOLDER_GRADIENTS = [
  "from-violet-600 to-purple-700",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-600",
  "from-amber-600 to-orange-600",
  "from-rose-600 to-pink-600",
  "from-indigo-600 to-blue-600",
] as const;

export function getGradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  const idx = Math.abs(hash) % PLACEHOLDER_GRADIENTS.length;
  return PLACEHOLDER_GRADIENTS[idx];
}
