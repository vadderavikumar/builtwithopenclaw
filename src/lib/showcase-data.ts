import { type ProductType } from "./utils";
import { APP_CATEGORIES, PLUGIN_CATEGORIES, SKILL_CATEGORIES } from "./utils";

/** Category-to-emoji mapping matching openclaw-showcase-main */
export const CATEGORY_EMOJI: Record<string, string> = {
  "AI Tools": "🔍",
  "Developer Tools": "💻",
  Design: "🎨",
  Productivity: "📈",
  Marketing: "📣",
  Analytics: "📊",
  "No Code": "🚫",
  "Content Creation": "✍️",
  Automation: "⚡",
  "E-Commerce": "🛒",
  Communication: "💬",
  SaaS: "☁️",
  "Self-hosted": "🖥️",
  Tool: "🔧",
  Plugin: "🧩",
  Template: "📄",
  "Integration/Service": "🔌",
  Hosting: "☁️",
  "Desktop App": "🖥️",
  "Voice/Call": "📞",
  Messaging: "💬",
  Memory: "🧠",
  OAuth: "🔐",
  Integration: "🔌",
  Workflow: "⚙️",
  "Web Automation": "🌐",
  Development: "💻",
  Finance: "💰",
  "Media & UI": "🖼️",
  Network: "🌍",
  "News & Info": "📰",
  "Runtime & OS": "⚙️",
  Security: "🔒",
  Utilities: "🛠️",
};

export const PRODUCT_TYPE_EMOJI: Record<ProductType, string> = {
  Application: "📱",
  Plugin: "🧩",
  Skill: "🎯",
  Extension: "🔌",
};

export const SHOWCASE_CATEGORIES = [
  { name: "All", emoji: "🏠" },
  { name: "AI Tools", emoji: "🤖" },
  { name: "Developer Tools", emoji: "💻" },
  { name: "Design", emoji: "🎨" },
  { name: "Productivity", emoji: "📈" },
  { name: "Marketing", emoji: "📣" },
  { name: "Analytics", emoji: "📊" },
  { name: "No Code", emoji: "🚫" },
  { name: "Content Creation", emoji: "👨‍🎨" },
  { name: "Automation", emoji: "⚡" },
  { name: "E-Commerce", emoji: "🛒" },
  { name: "Communication", emoji: "💬" },
] as const;

/** Categories for /plugins page sidebar */
export const PLUGIN_SIDEBAR_CATEGORIES = [
  { name: "All", emoji: "🧩" },
  ...PLUGIN_CATEGORIES.map((c) => ({ name: c, emoji: CATEGORY_EMOJI[c] ?? "🧩" })),
] as const;

/** Categories for /skills page sidebar */
export const SKILL_SIDEBAR_CATEGORIES = [
  { name: "All", emoji: "🎯" },
  ...SKILL_CATEGORIES.map((c) => ({ name: c, emoji: CATEGORY_EMOJI[c] ?? "🎯" })),
] as const;

/** Categories for /applications page sidebar */
export const APP_SIDEBAR_CATEGORIES = [
  { name: "All", emoji: "📱" },
  ...APP_CATEGORIES.slice(0, 12).map((c) => ({ name: c, emoji: CATEGORY_EMOJI[c] ?? "📱" })),
] as const;
