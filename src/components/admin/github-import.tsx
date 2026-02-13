"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GitHubImport() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  async function handleImport() {
    if (!url) return;
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/admin/github-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (res.ok) setData(result);
    } finally {
      setLoading(false);
    }
  }

  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  const isValid = !!match;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">GitHub repo URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className={cn(
              "flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            )}
          />
          <Button onClick={handleImport} disabled={!isValid || loading}>
            {loading ? "Importing..." : "Import"}
          </Button>
        </div>
      </div>
      {data && (
        <pre className="rounded-lg border bg-muted p-4 text-xs overflow-auto max-h-60">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
