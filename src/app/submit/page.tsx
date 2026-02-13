import { SubmitForm } from "@/components/submit-form";

export const metadata = {
  title: "Submit Listing",
  description: "Submit your product to the BuiltWithOpenClaw directory",
};

export default function SubmitPage() {
  return (
    <div className="container px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Submit your listing</h1>
        <p className="text-muted-foreground mt-2">
          Free listing with manual review. We typically review within 48 hours.
        </p>
        <SubmitForm className="mt-8" />
      </div>
    </div>
  );
}
