"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { getLogoApiUrl, getFaviconUrl, getCategoriesForProductType, type ProductType } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { PRODUCT_TYPE_EMOJI } from "@/lib/showcase-data";

type Props = { className?: string };

export function SubmitForm({ className }: Props) {
  const [form, setForm] = useState({
    name: "",
    url: "",
    product_type: "Application" as ProductType,
    category: "",
    description: "",
    pricing: "",
    tags: "",
    tagline: "",
    hosting_type: "SaaS",
    contact_email: "",
    logo_url: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const urlInputRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function handleAutoFetchLogo(source: "logo" | "favicon") {
    const url = urlInputRef.current?.value?.trim() || form.url;
    if (!url) return;
    const logoUrl = source === "logo" ? getLogoApiUrl(url) : getFaviconUrl(url);
    if (logoUrl) update("logo_url", logoUrl);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const honeypot = formData.get("website_extra") as string;
    if (honeypot) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          url: form.url,
          tagline: form.tagline || form.name,
          description: form.description,
          category: form.category,
          product_type: form.product_type,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          pricing_type: form.pricing || "Free",
          hosting_type: form.hosting_type,
          github_url: null,
          contact_email: form.contact_email || "noreply@example.com",
          logo_url: form.logo_url || null,
          screenshots: [],
          openclaw_proof: null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Submission failed");
      }
      setStatus("success");
      setForm({ name: "", url: "", product_type: "Application", category: "", description: "", pricing: "", tags: "", tagline: "", hosting_type: "SaaS", contact_email: "", logo_url: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-primary/10 p-6 text-center">
        <h2 className="font-display font-semibold text-lg text-foreground">Product submitted! 🎉</h2>
        <p className="text-muted-foreground mt-2">
          We&apos;ll review your submission and get back to you soon.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-body text-sm";

  const categoriesForSelect = getCategoriesForProductType(form.product_type);

  const handleProductTypeChange = (pt: ProductType) => {
    setForm((prev) => ({ ...prev, product_type: pt, category: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <input type="text" name="website_extra" className="hidden" tabIndex={-1} autoComplete="off" />
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product Type *</label>
        <div className="flex gap-2 flex-wrap">
          {(["Application", "Plugin", "Skill", "Extension"] as const).map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => handleProductTypeChange(pt)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                form.product_type === pt
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {PRODUCT_TYPE_EMOJI[pt]} {pt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
          <input
            required
            className={inputClass}
            placeholder="e.g. ClawSearch"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Website URL *</label>
          <input
            required
            type="url"
            ref={urlInputRef}
            className={inputClass}
            placeholder="https://..."
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
          <select
            required
            className={inputClass}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select a category</option>
            {categoriesForSelect.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Pricing</label>
          <input
            className={inputClass}
            placeholder="e.g. $9/mo, Free, Freemium"
            value={form.pricing}
            onChange={(e) => update("pricing", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
        <textarea
          required
          rows={4}
          className={inputClass + " resize-none"}
          placeholder="Tell us about your product..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
        <input
          className={inputClass}
          placeholder="Comma-separated, e.g. AI, Search, Freemium"
          value={form.tags}
          onChange={(e) => update("tags", e.target.value)}
        />
      </div>

      {/* Required for API - collapsed */}
      <details className="text-sm text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">Additional details</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tagline *</label>
            <input
              required
              className={inputClass}
              placeholder="Short one-liner"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contact email * (private)</label>
            <input
              type="email"
              required
              className={inputClass}
              placeholder="you@example.com"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Logo URL (optional)</label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="https://example.com/logo.png"
                value={form.logo_url}
                onChange={(e) => update("logo_url", e.target.value)}
              />
              <button type="button" onClick={() => handleAutoFetchLogo("logo")} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                <Sparkles className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => handleAutoFetchLogo("favicon")} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
                Favicon
              </button>
            </div>
          </div>
        </div>
      </details>

      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-lg bg-btn-coral px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-colors disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Submitting..." : "Submit Product"}
      </button>
    </form>
  );
}
