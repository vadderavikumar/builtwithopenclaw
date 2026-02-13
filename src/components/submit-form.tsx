"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, PRICING_TYPES, HOSTING_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function SubmitForm({ className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const honeypot = formData.get("website_extra") as string;
    if (honeypot) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const logoFile = formData.get("logo") as File;
      let logoUrl = "";
      if (logoFile?.size) {
        const logoFd = new FormData();
        logoFd.set("file", logoFile);
        logoFd.set("type", "logo");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: logoFd,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error ?? "Upload failed");
        }
        const uploadData = await uploadRes.json();
        logoUrl = uploadData.logoUrl ?? uploadData.url ?? "";
      }

      const screenshots: string[] = [];
      const screenshotFiles = formData.getAll("screenshots") as File[];
      for (const f of screenshotFiles) {
        if (f?.size) {
          const fd = new FormData();
          fd.set("file", f);
          fd.set("type", "screenshot");
          const up = await fetch("/api/upload", { method: "POST", body: fd });
          if (up.ok) {
            const d = await up.json();
            if (d.url) screenshots.push(d.url);
          }
        }
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          url: formData.get("url"),
          tagline: formData.get("tagline"),
          description: formData.get("description"),
          category: formData.get("category"),
          tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
          pricing_type: formData.get("pricing_type"),
          hosting_type: formData.get("hosting_type"),
          github_url: formData.get("github_url") || null,
          contact_email: formData.get("contact_email"),
          logo_url: logoUrl || null,
          screenshots,
          openclaw_proof: formData.get("openclaw_proof") || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Submission failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border bg-green-500/10 border-green-500/30 p-6 text-center">
        <h2 className="font-semibold text-lg">Thank you!</h2>
        <p className="text-muted-foreground mt-2">
          Your listing has been submitted and is pending review. We&apos;ll get back to you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <input
        type="text"
        name="website_extra"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />
      <div>
        <label className="block text-sm font-medium mb-2">Name *</label>
        <input
          name="name"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Website URL *</label>
        <input
          name="url"
          type="url"
          required
          placeholder="https://"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Tagline *</label>
        <input
          name="tagline"
          required
          placeholder="Short one-liner"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description * (Markdown supported)</label>
        <textarea
          name="description"
          required
          rows={6}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <select
          name="category"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
        <input
          name="tags"
          placeholder="ai, saas, automation"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Pricing type *</label>
          <select
            name="pricing_type"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {PRICING_TYPES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hosting type *</label>
          <select
            name="hosting_type"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {HOSTING_TYPES.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">GitHub URL (optional)</label>
        <input
          name="github_url"
          type="url"
          placeholder="https://github.com/..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Built with OpenClaw (proof/links, optional)</label>
        <textarea
          name="openclaw_proof"
          rows={3}
          placeholder="Links or description showing OpenClaw usage"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Contact email * (private)</label>
        <input
          name="contact_email"
          type="email"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Logo *</label>
        <input
          name="logo"
          type="file"
          accept="image/*"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Screenshots (optional)</label>
        <input
          name="screenshots"
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
