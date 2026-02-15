import { Star, Check } from "lucide-react";
import { GetFeaturedForm } from "@/components/get-featured-form";
import { buildMetadata } from "@/lib/metadata";
import { AdSlot } from "@/components/ad-slot";

export const metadata = buildMetadata({
  title: "Get Featured",
  description:
    "Get your OpenClaw product featured on BuiltWithOpenClaw homepage. $49/week for homepage featured placement. 10 slots per week, first-come-first-serve.",
  path: "/get-featured",
  keywords: ["featured OpenClaw", "promote OpenClaw product", "OpenClaw directory featured"],
});

export default function GetFeaturedPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <main className="flex-1 min-w-0 max-w-2xl">
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
                Get Featured
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Stand out with a featured slot on our homepage. 10 slots per week, first-come-first-serve.
              </p>
            </div>

            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-primary/20 p-2">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">$49/week</p>
                  <p className="text-sm text-muted-foreground">Featured placement</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  Featured placement on homepage
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  10 slots per week
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  First-come-first-serve (subject to basic review)
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  Your listing must be approved first
                </li>
              </ul>
            </div>

            <GetFeaturedForm />
          </main>

          <aside className="lg:w-72 shrink-0 space-y-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sponsored
              </p>
              <AdSlot slot="get-featured-sidebar" size="sidebar" className="w-full" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
