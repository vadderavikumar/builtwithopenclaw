import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img src="/openclaw-logo.png" alt="OpenClaw" className="h-9 w-9 rounded-lg" />
          <span className="font-display text-xl font-bold text-foreground">
            BuiltWith OpenClaw
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/directory"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Discover
          </Link>
          <Link
            href="/collections"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Favorites
          </Link>
          <Link
            href="/submit"
            className="rounded-full bg-btn-coral px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            Submit
          </Link>
        </nav>
      </div>
    </header>
  );
}
