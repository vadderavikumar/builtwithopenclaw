"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

interface CopyLinkButtonProps {
  url?: string;
  className?: string;
}

export function CopyLinkButton({ url, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const toCopy = url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      title="Copy link"
      aria-label="Copy link"
    >
      {copied ? (
        <span className="text-sm text-muted-foreground">Copied!</span>
      ) : (
        <span className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Link2 className="h-4 w-4" />
          Copy link
        </span>
      )}
    </button>
  );
}
