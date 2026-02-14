/**
 * Seed script - run with: npx tsx scripts/seed-research.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL (in .env or .env.local)
 *
 * Populates listings with real OpenClaw products from:
 */
import { config } from "dotenv";

// Load .env then .env.local (Next.js - .env.local overrides)
config({ path: ".env" });
config({ path: ".env.local", override: true });

/**
 * Sources:
 * - TrustMRR (trustmrr.com/special-category/openclaw)
 * - Product Hunt (ClawApp)
 * - Y Combinator (Klaus)
 * - openclawskills.dev
 * - docs.openclaw.ai (plugins)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const researchListings = [
  // === APPLICATIONS (TrustMRR, Product Hunt, YC) ===
  {
    name: "SimpleClaw",
    url: "https://simpleclaw.com",
    tagline: "One-click deploy OpenClaw under 1 minute",
    description: "Avoid all technical complexity. One-click deploy your own 24/7 active OpenClaw instance. Connect AI models like Claude, GPT, or Gemini. Connect Telegram, Discord, WhatsApp. No servers or DevOps required.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["hosting", "one-click", "deployment", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "ClawWrapper",
    url: "https://clawwrapper.com",
    tagline: "SaaS boilerplate for OpenClaw wrappers",
    description: "Ship your OpenClaw wrapper faster. Production-ready template with Auth, Stripe billing, Docker deployment, admin panel, AI model selection, Telegram integration. Rebrand and launch your own OpenClaw wrapper business.",
    category: "Developer Tools",
    product_type: "Application" as const,
    tags: ["saas", "boilerplate", "stripe", "trustmrr"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "1MinuteClaw",
    url: "https://1minuteclaw.com",
    tagline: "Deploy OpenClaw in under 1 minute",
    description: "One-click deploy your own 24/7 active OpenClaw instance. Built for non-technical users. No servers, no terminal, no complexity.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["hosting", "one-click", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "ClawApp",
    url: "https://clawapp.com",
    tagline: "OpenClaw made easy - macOS desktop app",
    description: "The first open-source desktop app for OpenClaw. Install, manage, and run local OpenClaw agents without manual setup. Add skills with one click. Deploy to Telegram and Moltbook. Product of the Day on Product Hunt.",
    category: "Desktop App",
    product_type: "Application" as const,
    tags: ["macos", "desktop", "product-hunt"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Klaus",
    url: "https://getklaus.com",
    tagline: "OpenClaw personal assistant in 5 minutes",
    description: "Y Combinator launch. Get your OpenClaw personal assistant hosted on a VM with built-in security and privacy. No setup required.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["yc", "hosting", "managed"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "Agent 37",
    url: "https://agent37.io",
    tagline: "Create and manage your OpenClaw agents",
    description: "Platform for creating and managing OpenClaw agents. Simplify agent deployment and management.",
    category: "AI Tools",
    product_type: "Application" as const,
    tags: ["agents", "management", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "AlfredClaw",
    url: "https://alfredclaw.com",
    tagline: "OpenClaw on demand",
    description: "Access OpenClaw when you need it. On-demand AI assistant powered by OpenClaw.",
    category: "AI Tools",
    product_type: "Application" as const,
    tags: ["on-demand", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "Quick Claw",
    url: "https://quickclaw.app",
    tagline: "OpenClaw on your phone in under 30 seconds",
    description: "One app, sign in and chat with your AI assistant. No Telegram, API keys, or config. Get started in 30 seconds.",
    category: "Communication",
    product_type: "Application" as const,
    tags: ["mobile", "quick-start", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "Keepsake",
    url: "https://keepsake.so",
    tagline: "Personal CRM with OpenClaw/MCP compatibility",
    description: "Personal CRM that connects notes, tasks, and contacts. Capture ideas with QuickNotes, organize with Time Blocks. Full API + MCP server so your AI agents can read, write, and remember. Compatible with OpenClaw. Built as PWA.",
    category: "Productivity",
    product_type: "Application" as const,
    tags: ["crm", "mcp", "pwa", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "lobsterfarm",
    url: "https://lobsterfarm.io",
    tagline: "Deploy OpenClaw in 30 seconds on a VPS",
    description: "Deploy OpenClaw on Hetzner VPS in 30 seconds. Get SSH access and eject anytime. Built-in browser, email integration. Let your bot surf the web, engage on social, send emails.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["vps", "hetzner", "trustmrr"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "OpenClaw Cloud",
    url: "https://openclawcloud.app",
    tagline: "Serverless evolution of OpenClaw",
    description: "Deploy OpenClaw under 1 minute. Serverless hosting for the open-source AI assistant.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["serverless", "hosting"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "Clawctl",
    url: "https://clawctl.com",
    tagline: "Secure, managed OpenClaw hosting",
    description: "Fully managed OpenClaw instances with security hardening, audit logging, and human approvals. Dedicated instances starting at $49/month.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["managed", "security", "enterprise"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "Clawhosters",
    url: "https://clawhosters.com",
    tagline: "Managed hosting for OpenClaw",
    description: "Managed hosting for OpenClaw. Instant deployment, zero-maintenance infrastructure, multi-platform support. No technical expertise required.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["hosting", "managed", "trustmrr"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "ClawSimple",
    url: "https://clawsimple.com",
    tagline: "One-click safe deployment for OpenClaw",
    description: "One-click, safe and secure deployment for OpenClaw. Have one or multiple OpenClaw bots in minutes without touching the terminal.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["hosting", "one-click", "trustmrr"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "YourClaw",
    url: "https://yourclaw.dev",
    tagline: "AI assistant through WhatsApp",
    description: "AI-powered personal assistant via WhatsApp. Connects to Gmail, Google Calendar, Drive. Manage emails, schedule meetings, summarize documents. Turns WhatsApp into a productivity hub.",
    category: "Communication",
    product_type: "Application" as const,
    tags: ["whatsapp", "productivity", "trustmrr"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  {
    name: "SafeClaw",
    url: "https://safeclaw.com",
    tagline: "Secure your OpenClaw experience",
    description: "SafeClaw secures your OpenClaw experience while keeping things simple. Enhanced security for your AI assistant.",
    category: "Security",
    product_type: "Application" as const,
    tags: ["security", "trustmrr"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "ClawdHost",
    url: "https://clawdhost.com",
    tagline: "Managed hosting for Clawdbot and OpenClaw",
    description: "Managed hosting for Clawdbot, Moltbot and OpenClaw. No VPS, no Docker, no SSH. Just your personal AI assistant ready to go.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["hosting", "managed", "trustmrr"],
    pricing_type: "Paid",
    hosting_type: "SaaS",
  },
  {
    name: "GetOpenClaw",
    url: "https://www.getopenclaw.ai",
    tagline: "OpenClaw setup and hosting help",
    description: "Help with OpenClaw VPS hosting setup, configuration, and deployment. Guides and managed setup.",
    category: "Hosting",
    product_type: "Application" as const,
    tags: ["hosting", "setup", "guides"],
    pricing_type: "Freemium",
    hosting_type: "SaaS",
  },
  // === SKILLS (openclawskills.dev) ===
  {
    name: "Browser Skill",
    url: "https://openclawskills.dev/skills/browser/",
    tagline: "Full browser control for OpenClaw",
    description: "Full control of OpenClaw-managed browser: click, type, screenshot, and navigate. Web automation at your fingertips.",
    category: "Web Automation",
    product_type: "Skill" as const,
    tags: ["browser", "automation", "web"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Web Search Skill",
    url: "https://openclawskills.dev/skills/web-search/",
    tagline: "Search the live web with Brave Search",
    description: "Search the live web using Brave Search API for up-to-date information. Real-time web search capability for your agent.",
    category: "Web Automation",
    product_type: "Skill" as const,
    tags: ["search", "brave", "web"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Exec Skill",
    url: "https://openclawskills.dev/skills/exec/",
    tagline: "Run shell commands in secure workspace",
    description: "Run shell commands in the secure workspace or host environment. Built-in skill with configurable permissions.",
    category: "Runtime & OS",
    product_type: "Skill" as const,
    tags: ["shell", "exec", "runtime"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Message Skill",
    url: "https://openclawskills.dev/skills/message/",
    tagline: "Send messages across platforms",
    description: "Send messages across WhatsApp, Telegram, Discord, Slack, and Signal. Built-in auto-routed messaging.",
    category: "Communication",
    product_type: "Skill" as const,
    tags: ["messaging", "telegram", "discord"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Canvas Skill",
    url: "https://openclawskills.dev/skills/canvas/",
    tagline: "Render UI and present content",
    description: "Drive the node Canvas to render UI, present content, or take snapshots. Visual output for your agent.",
    category: "Media & UI",
    product_type: "Skill" as const,
    tags: ["canvas", "ui", "visual"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Cron Skill",
    url: "https://openclawskills.dev/skills/cron/",
    tagline: "Schedule recurring background jobs",
    description: "Schedule recurring background jobs and wakeups for the agent. Built-in cron.add() for scheduled tasks.",
    category: "Automation",
    product_type: "Skill" as const,
    tags: ["cron", "scheduling", "automation"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "HackerNews Digest",
    url: "https://openclawskills.dev/skills/hackernews-digest/",
    tagline: "Fetch and summarize Hacker News",
    description: "Fetch top stories from Hacker News and summarize them. Custom script for news aggregation.",
    category: "News & Info",
    product_type: "Skill" as const,
    tags: ["hackernews", "news", "digest"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Stock Ticker",
    url: "https://openclawskills.dev/skills/stock-ticker/",
    tagline: "Real-time stock prices",
    description: "Get real-time stock prices for a given symbol using Yahoo Finance API. Custom script for finance.",
    category: "Finance",
    product_type: "Skill" as const,
    tags: ["stocks", "finance", "yahoo"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Weather Check",
    url: "https://openclawskills.dev/skills/weather-check/",
    tagline: "Current weather for any city",
    description: "Get current weather for any city using OpenMeteo API. No API key required.",
    category: "Utilities",
    product_type: "Skill" as const,
    tags: ["weather", "openmeteo"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Currency Converter",
    url: "https://openclawskills.dev/skills/currency-converter/",
    tagline: "Convert between currencies",
    description: "Convert between currencies using live exchange rates. Custom script for finance.",
    category: "Finance",
    product_type: "Skill" as const,
    tags: ["currency", "finance", "exchange"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "YouTube Transcription",
    url: "https://openclawskills.dev/skills/youtube-transcription/",
    tagline: "Extract transcript from YouTube",
    description: "Extract transcript from a YouTube video URL for summarization. Media processing skill.",
    category: "Media & UI",
    product_type: "Skill" as const,
    tags: ["youtube", "transcription", "media"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "GitHub Trending",
    url: "https://openclawskills.dev/skills/github-trending/",
    tagline: "List trending repositories",
    description: "List currently trending repositories on GitHub by language. Development discovery skill.",
    category: "Development",
    product_type: "Skill" as const,
    tags: ["github", "trending", "development"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Notion Page",
    url: "https://openclawskills.dev/skills/notion-page/",
    tagline: "Create pages in Notion",
    description: "Create a new page in a Notion database. Productivity integration skill.",
    category: "Productivity",
    product_type: "Skill" as const,
    tags: ["notion", "productivity"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Web Fetch",
    url: "https://openclawskills.dev/skills/web-fetch/",
    tagline: "Fetch URLs and convert to markdown",
    description: "Fetch URLs and convert HTML content to clean markdown for reading. Web content extraction.",
    category: "Web Automation",
    product_type: "Skill" as const,
    tags: ["fetch", "markdown", "web"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  {
    name: "Lobster Skill",
    url: "https://openclawskills.dev/skills/lobster/",
    tagline: "Typed workflow runtime with approvals",
    description: "Typed workflow runtime for complex tasks with resumable human approvals. Plugin: install lobster-cli.",
    category: "Runtime & OS",
    product_type: "Skill" as const,
    tags: ["workflow", "lobster", "approvals"],
    pricing_type: "Free",
    hosting_type: "Self-hosted",
  },
  // === PLUGINS (docs.openclaw.ai) ===
  {
    name: "@openclaw/voice-call",
    url: "https://docs.openclaw.ai/plugin",
    tagline: "Voice call support for OpenClaw",
    description: "Official OpenClaw plugin for voice call functionality. Add voice capabilities to your agent.",
    category: "Voice/Call",
    product_type: "Plugin" as const,
    tags: ["voice", "call", "official"],
    pricing_type: "OSS",
    hosting_type: "Self-hosted",
  },
  {
    name: "@openclaw/msteams",
    url: "https://docs.openclaw.ai/plugin",
    tagline: "Microsoft Teams integration",
    description: "Official OpenClaw plugin for Microsoft Teams. Connect your agent to Teams.",
    category: "Messaging",
    product_type: "Plugin" as const,
    tags: ["teams", "microsoft", "official"],
    pricing_type: "OSS",
    hosting_type: "Self-hosted",
  },
  {
    name: "OpenClaw Skills",
    url: "https://openclawskills.dev",
    tagline: "Largest library of OpenClaw extensions",
    description: "The largest community library of extensions for your AI agent. Browse, install, and supercharge your workflow. Categories: Web Automation, Communication, Development, Finance, Media, Utilities, and more.",
    category: "Integration",
    product_type: "Application" as const,
    tags: ["skills", "registry", "extensions"],
    pricing_type: "Free",
    hosting_type: "Both",
  },
];

async function seed() {
  console.log(`Seeding ${researchListings.length} listings from research...\n`);

  for (const item of researchListings) {
    // Check for existing listing by name (avoid duplicates on re-run)
    const { data: existing } = await supabase
      .from("listings")
      .select("id, slug")
      .eq("name", item.name)
      .maybeSingle();

    let slug: string;
    if (existing) {
      slug = existing.slug;
    } else {
      const baseSlug = slugify(item.name);
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: slugExists } = await supabase.from("listings").select("id").eq("slug", slug).maybeSingle();
        if (!slugExists) break;
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const listing = {
      slug,
      name: item.name,
      url: item.url,
      tagline: item.tagline,
      description: item.description,
      category: item.category,
      product_type: item.product_type,
      tags: item.tags,
      pricing_type: item.pricing_type,
      hosting_type: item.hosting_type,
      logo_url: null,
      screenshots: [],
      status: "published" as const,
      published_at: new Date().toISOString(),
      verified: false,
    };

    const { error } = await supabase.from("listings").upsert(listing, { onConflict: "slug" });
    if (error) {
      console.error(`Error seeding ${item.name}:`, error.message);
    } else {
      console.log(`  ✓ ${item.name} (${item.product_type})${existing ? " [updated]" : ""}`);
    }
  }

  console.log(`\nDone! Seeded ${researchListings.length} listings.`);
}

seed();
