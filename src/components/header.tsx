"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchAutocomplete } from "@/components/search-autocomplete";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
          <Link href="/" className="order-1 flex items-center gap-3">
            <img src="/openclaw-logo.png" alt="OpenClaw" className="h-9 w-9 rounded-lg" />
            <span className="font-display text-xl font-bold text-foreground">
              BuiltWith OpenClaw
            </span>
          </Link>

          <div className="order-2 w-full lg:order-2 lg:w-[360px] lg:shrink-0">
            <SearchAutocomplete
              variant="header"
              showKeyboardHint
              placeholder="Search products, plugins, and skills..."
            />
          </div>

          <nav className="order-3 flex flex-wrap items-center gap-2 sm:gap-3 lg:order-3 lg:flex-nowrap">
          <Link
            href="/directory"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50"
          >
            Directory
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50"
          >
            Blog
          </Link>
            <Link
              href="/get-featured"
              className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              Get Featured — $49<span className="text-primary/80 font-normal">/wk</span>
            </Link>
            <ThemeToggle />
            <Link
              href="/submit"
              className="rounded-full bg-btn-coral px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Submit
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
