"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command, Search } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  category: string;
  product_type: string | null;
};

interface SearchAutocompleteProps {
  basePath?: string;
  placeholder?: string;
  variant?: "default" | "header";
  showKeyboardHint?: boolean;
  /** When provided, used for controlled filter mode (e.g. directory) */
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchAutocomplete({
  basePath = "/directory",
  placeholder = "Search products...",
  variant = "default",
  showKeyboardHint = false,
  value,
  onChange,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalQuery, setInternalQuery] = useState("");
  const query = isControlled ? value : internalQuery;
  const setQuery = isControlled ? onChange : setInternalQuery;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setSelectedIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchResults(query);
      setOpen(true);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(slug: string) {
    router.push(`${basePath}/${slug}`);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHeader = variant === "header";
  const inputClassName = isHeader
    ? "w-full rounded-xl border border-border/70 bg-card/70 py-2.5 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground/90 shadow-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
    : "w-full rounded-lg border border-border bg-muted/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-body";
  const panelClassName = isHeader
    ? "absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border/80 bg-background/95 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden backdrop-blur-xl"
    : "absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden";

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
            isHeader ? "left-3 h-4 w-4" : "left-4 h-5 w-5"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          className={inputClassName}
          autoComplete="off"
          aria-label="Search listings"
        />
        {showKeyboardHint && isHeader && (
          <span className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </span>
        )}
      </div>
      {open && (
        <div className={panelClassName}>
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5 text-xs text-muted-foreground">
            <span>Suggestions</span>
            <span>{loading ? "Searching..." : `${results.length} found`}</span>
          </div>
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Searching...</div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-foreground">No matching products</p>
              <p className="mt-1 text-xs text-muted-foreground">Try another keyword or category.</p>
            </div>
          ) : (
            <ul className="max-h-64 overflow-auto">
              {results.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(r.slug)}
                    className={`w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                      i === selectedIndex ? "bg-primary/8 dark:bg-primary/12" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.tagline || r.category}
                      </p>
                    </div>
                    <span className="text-[11px] rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 text-muted-foreground shrink-0">
                      {r.product_type || r.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border/70 px-4 py-2 text-[11px] text-muted-foreground">
            Use ↑ ↓ to navigate and Enter to open
          </div>
        </div>
      )}
    </div>
  );
}
