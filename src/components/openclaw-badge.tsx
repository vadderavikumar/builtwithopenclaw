"use client";

import Link from "next/link";

interface OpenClawBadgeProps {
  className?: string;
  compact?: boolean;
}

export function OpenClawBadge({ className, compact }: OpenClawBadgeProps) {
  return (
    <Link
      href="https://openclaw.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors ${className ?? ""}`}
      title="Built with OpenClaw"
    >
      {compact ? (
        <span className="text-[10px] font-medium uppercase tracking-wide">
          OpenClaw
        </span>
      ) : (
        <span className="text-xs font-medium">
          Built with <span className="text-primary font-semibold">OpenClaw</span>
        </span>
      )}
    </Link>
  );
}
