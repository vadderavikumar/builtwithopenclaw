import Link from "next/link";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetFeaturedForm } from "@/components/get-featured-form";

export const metadata = {
  title: "Get Featured",
  description: "Get your listing featured on BuiltWithOpenClaw for $49/week",
};

export default function GetFeaturedPage() {
  return (
    <div className="container px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Get Featured</h1>
        <p className="text-muted-foreground mt-2">
          Stand out with a featured slot on our homepage. 10 slots per week, first-come-first-serve.
        </p>

        <div className="mt-8 rounded-lg border bg-primary/5 border-primary/20 p-6">
          <div className="flex items-center gap-2 font-semibold text-lg mb-4">
            <Star className="h-5 w-5 text-primary" />
            $49/week
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              Featured placement on homepage
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              10 slots per week
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              First-come-first-serve (subject to basic review)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary shrink-0" />
              Your listing must be approved first
            </li>
          </ul>
        </div>

        <GetFeaturedForm className="mt-8" />
      </div>
    </div>
  );
}
