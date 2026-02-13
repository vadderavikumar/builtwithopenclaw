import Link from "next/link";
import { Search, PlusCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          BuiltWithOpenClaw
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/directory"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Browse
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Collections
          </Link>
          <Link href="/submit">
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Submit
            </Button>
          </Link>
          <Link href="/get-featured">
            <Button size="sm" className="gap-1">
              <Star className="h-4 w-4" />
              Get Featured
            </Button>
          </Link>
        </nav>
        <div className="flex md:hidden gap-2">
          <Link href="/submit">
            <Button variant="outline" size="sm">Submit</Button>
          </Link>
          <Link href="/get-featured">
            <Button size="sm">Featured</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
