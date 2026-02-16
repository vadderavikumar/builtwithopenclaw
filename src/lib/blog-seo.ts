import sanitizeHtml from "sanitize-html";
import { slugify } from "@/lib/utils";

export function sanitizeBlogHtml(input: string): string {
  return sanitizeHtml(input ?? "", {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["id", "class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}

export function estimateReadingTimeMinutes(html: string): number {
  const plainText = sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} });
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 220);
  return Math.max(1, minutes);
}

export function normalizeKeywords(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 25);
}

export function safeParseFaqJson(jsonText: string): unknown | null {
  const raw = jsonText.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createUniqueSlug(
  baseTitle: string,
  exists: (candidate: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(baseTitle || "post");
  if (!(await exists(base))) return base;

  let count = 2;
  while (count < 5000) {
    const candidate = `${base}-${count}`;
    if (!(await exists(candidate))) return candidate;
    count += 1;
  }

  return `${base}-${Date.now()}`;
}
