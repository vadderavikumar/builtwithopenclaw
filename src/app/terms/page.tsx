import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "BuiltWithOpenClaw Terms of Service. By using the directory you agree to our terms. Listings subject to manual review. We reserve the right to remove violating content.",
  path: "/terms",
  keywords: ["BuiltWithOpenClaw terms", "OpenClaw directory terms", "terms of service"],
});

export default function TermsPage() {
  const lastUpdated = "2025-02-13";

  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using BuiltWithOpenClaw (&quot;the Site&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site. We reserve the right to modify these terms at any time; continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            BuiltWithOpenClaw is a curated directory of products built with OpenClaw. We list SaaS applications, plugins, skills, and extensions. Listings are subject to manual review. We are independent curators and are not directly affiliated with OpenClaw or the products listed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Submitting Listings</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When you submit a product for listing:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>You represent that you have the right to submit the product and that the information provided is accurate.</li>
            <li>Submissions are subject to manual review. We may approve, reject, or request changes at our discretion.</li>
            <li>We reserve the right to remove any listing that violates our guidelines, contains false information, or is reported as inappropriate.</li>
            <li>Contact emails provided are used only for review communication and are not displayed publicly without consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Featured Listings</h2>
          <p className="text-muted-foreground leading-relaxed">
            Featured placement is a paid service ($49/week). Featured slots are subject to availability—we only allow purchases when slots are available for the current week. Payment does not guarantee approval of a listing. All sales are final; no refunds. See our Refund Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. User Conduct</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Submit false, misleading, or fraudulent information.</li>
            <li>Submit products that infringe on intellectual property rights.</li>
            <li>Submit products that contain malware, illegal content, or violate applicable laws.</li>
            <li>Use the Site for spam, scraping, or automated abuse.</li>
            <li>Attempt to gain unauthorized access to our systems or other users&apos; data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            The BuiltWithOpenClaw name, logo, and site design are our property. Product names, logos, and trademarks in listings belong to their respective owners. We do not claim ownership of listed products. By submitting a listing, you grant us a non-exclusive license to display your product information on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Site is provided &quot;as is&quot; without warranties of any kind. We do not endorse, guarantee, or assume responsibility for any listed product. Your use of any third-party product is at your own risk. We are not liable for any damages arising from your use of the Site or listed products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the fullest extent permitted by law, BuiltWithOpenClaw shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may suspend or terminate your access to the Site, or remove your listing, at any time for violation of these terms or at our discretion. You may request removal of your listing by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These terms are governed by the laws of the jurisdiction in which we operate. Any disputes shall be resolved in the appropriate courts of that jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these terms, please contact us through the email provided in your submission or via our contact methods listed on the Site.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex gap-4">
        <Link href="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
        <Link href="/refund" className="text-sm text-primary hover:underline">Refund Policy</Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Back to Home</Link>
      </div>
    </div>
  );
}
