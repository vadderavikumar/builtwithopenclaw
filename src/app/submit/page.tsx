import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubmitForm } from "@/components/submit-form";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Submit a Product",
  description:
    "Submit your product to the BuiltWithOpenClaw directory. Free listing for OpenClaw-powered SaaS, plugins, skills, and extensions. Manual review.",
  path: "/submit",
  keywords: ["submit OpenClaw product", "add to OpenClaw directory", "list OpenClaw app"],
});

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to directory
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Submit a Product
        </h1>
        <p className="text-muted-foreground mb-10">
          Built something with OpenClaw? Share it with the community.
        </p>

        <SubmitForm />
      </div>
    </div>
  );
}
