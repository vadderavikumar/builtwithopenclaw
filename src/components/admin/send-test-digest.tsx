"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SendTestDigest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/newsletter/test-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleClick}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send test digest"}
      </Button>
      {status === "success" && (
        <span className="text-sm text-muted-foreground">Sent!</span>
      )}
      {status === "error" && (
        <span className="text-sm text-destructive">Failed</span>
      )}
    </div>
  );
}
