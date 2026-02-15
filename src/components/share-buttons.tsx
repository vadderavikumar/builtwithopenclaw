"use client";

import { Share2, Twitter, Linkedin, MessageCircle } from "lucide-react";

const base = typeof window !== "undefined" ? window.location.origin : "";

function buildShareUrl(platform: string, url: string, title: string, text?: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text ?? title);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "reddit":
      return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "hackernews":
      return `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`;
    default:
      return url;
  }
}

interface ShareButtonsProps {
  url?: string;
  title: string;
  text?: string;
  compact?: boolean;
}

export function ShareButtons({ url, title, text, compact }: ShareButtonsProps) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : base);

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text ?? title,
          url: shareUrl,
        });
      } catch {
        // Fallback to opening Twitter
        window.open(buildShareUrl("twitter", shareUrl, title, text), "_blank", "noopener,noreferrer");
      }
    } else {
      window.open(buildShareUrl("twitter", shareUrl, title, text), "_blank", "noopener,noreferrer");
    }
  }

  function handleShare(platform: string) {
    window.open(buildShareUrl(platform, shareUrl, title, text), "_blank", "noopener,noreferrer");
  }

  const btnClass = compact
    ? "rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    : "rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      <button
        type="button"
        onClick={handleNativeShare}
        className={btnClass}
        title="Share"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
        {!compact && <span>Share</span>}
      </button>
      <button
        type="button"
        onClick={() => handleShare("twitter")}
        className={btnClass}
        title="Share on X"
        aria-label="Share on X"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => handleShare("linkedin")}
        className={btnClass}
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => handleShare("reddit")}
        className={btnClass}
        title="Share on Reddit"
        aria-label="Share on Reddit"
      >
        <MessageCircle className="h-4 w-4" />
      </button>
      <a
        href={buildShareUrl("hackernews", shareUrl, title)}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        title="Share on Hacker News"
        aria-label="Share on Hacker News"
      >
        <span className="text-xs font-bold text-orange-500">Y</span>
      </a>
    </div>
  );
}
