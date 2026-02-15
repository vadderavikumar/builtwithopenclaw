import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="font-bold text-sm text-foreground hover:opacity-80">
                BuiltWith OpenClaw
              </Link>
              <ThemeToggle />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A curated directory of products built with OpenClaw.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/directory" className="text-muted-foreground hover:text-foreground transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-muted-foreground hover:text-foreground transition-colors">
                  New this week
                </Link>
              </li>
              <li>
                <Link href="/applications" className="text-muted-foreground hover:text-foreground transition-colors">
                  Applications
                </Link>
              </li>
              <li>
                <Link href="/plugins" className="text-muted-foreground hover:text-foreground transition-colors">
                  Plugins
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-muted-foreground hover:text-foreground transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
                  Submit Listing
                </Link>
              </li>
              <li>
                <Link href="/get-featured" className="text-muted-foreground hover:text-foreground transition-colors">
                  Get Featured
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Newsletter</h3>
            <NewsletterSignup />
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border space-y-4 text-center text-sm text-muted-foreground">
          <p>
            Built with love for{" "}
            <a href="https://openclaw.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              OpenClaw.ai
            </a>
            . We are not directly associated with OpenClaw — we are independent curators who research and add products to this directory. All trademarks belong to their respective owners.
          </p>
          <p>© {new Date().getFullYear()} BuiltWith OpenClaw. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
