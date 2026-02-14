import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About BuiltWithOpenClaw",
  description:
    "BuiltWithOpenClaw is a curated directory of products built with OpenClaw. We help developers and users discover SaaS, plugins, skills, and extensions. Independent curators, not affiliated with OpenClaw.",
  path: "/about",
  keywords: ["BuiltWithOpenClaw", "about", "OpenClaw directory", "curated directory"],
});

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-6">About BuiltWithOpenClaw</h1>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          BuiltWithOpenClaw is a curated directory of products built with{" "}
          <a href="https://openclaw.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            OpenClaw
          </a>
          . We help developers, businesses, and users discover the best SaaS applications, plugins, skills, and extensions in the OpenClaw ecosystem.
        </p>

        <h2 className="text-xl font-semibold mt-8">What We Do</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li><strong>Curate</strong> — We manually review and list products that integrate with or extend OpenClaw.</li>
          <li><strong>Organize</strong> — Browse by product type (Applications, Plugins, Skills) and category.</li>
          <li><strong>Support builders</strong> — Free listings for approved products. Featured placement for visibility.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Product Types</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li><strong>Applications</strong> — SaaS, desktop apps, hosting, and tools built with OpenClaw.</li>
          <li><strong>Plugins</strong> — npm packages and extensions that add voice, messaging, OAuth, and more.</li>
          <li><strong>Skills</strong> — AgentSkills and SKILL.md extensions for web automation, development, and productivity.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Independence</h2>
        <p className="text-muted-foreground leading-relaxed">
          We are independent curators. We are not directly affiliated with OpenClaw or the products we list. All trademarks belong to their respective owners. We research and add products to help the community discover what&apos;s available.
        </p>

        <h2 className="text-xl font-semibold mt-8">Get Involved</h2>
        <p className="text-muted-foreground leading-relaxed">
          Built something with OpenClaw?{" "}
          <Link href="/submit" className="text-primary hover:underline">Submit your product</Link> for a free listing. Want more visibility?{" "}
          <Link href="/get-featured" className="text-primary hover:underline">Get featured</Link> on our homepage.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4">
        <Link href="/directory" className="text-sm text-primary hover:underline">Browse Directory</Link>
        <Link href="/plugins" className="text-sm text-primary hover:underline">Plugins</Link>
        <Link href="/skills" className="text-sm text-primary hover:underline">Skills</Link>
        <Link href="/applications" className="text-sm text-primary hover:underline">Applications</Link>
        <Link href="/submit" className="text-sm text-primary hover:underline">Submit</Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Back to Home</Link>
      </div>
    </div>
  );
}
