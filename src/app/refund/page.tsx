import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Refund Policy",
  description:
    "BuiltWithOpenClaw refund policy. All featured slot purchases are final. No refunds.",
  path: "/refund",
  keywords: ["BuiltWithOpenClaw refund", "featured slot", "no refunds"],
});

export default function RefundPage() {
  const lastUpdated = "2025-02-13";

  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-2">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. No Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            All featured slot purchases on BuiltWithOpenClaw are <strong>final and non-refundable</strong>. Once payment is completed, we do not issue refunds for any reason, including but not limited to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-3">
            <li>Change of mind</li>
            <li>Listing not yet approved or under review</li>
            <li>Listing removed or modified after purchase</li>
            <li>Partial use of the featured period</li>
            <li>Technical issues or display preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Featured Slot Purchases</h2>
          <p className="text-muted-foreground leading-relaxed">
            Homepage featured is $49/week; blog featured is $29/week. Payment secures a slot for the current week. Slots are assigned on a first-come-first-serve basis. By completing payment, you acknowledge that the purchase is final.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Free Listings</h2>
          <p className="text-muted-foreground leading-relaxed">
            Standard directory listings are free. No refund applies to free services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about this policy, contact us through the email provided in your submission or payment confirmation.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex gap-4">
        <Link href="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
        <Link href="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Back to Home</Link>
      </div>
    </div>
  );
}
