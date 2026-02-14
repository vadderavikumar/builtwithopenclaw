import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "BuiltWithOpenClaw Privacy Policy. We collect email for submissions and newsletter. We do not sell your data. Contact emails kept private. Learn how we handle your information.",
  path: "/privacy",
  keywords: ["BuiltWithOpenClaw privacy", "OpenClaw directory privacy", "data protection"],
});

export default function PrivacyPage() {
  const lastUpdated = "2025-02-13";

  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-display font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            BuiltWithOpenClaw (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data when you use our directory and related services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We collect the following types of information:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Submission data:</strong> When you submit a product, we collect product name, URL, description, tagline, category, and contact email. The contact email is used only for review communication and is not displayed publicly.</li>
            <li><strong>Newsletter signups:</strong> If you subscribe to our newsletter, we collect your email address.</li>
            <li><strong>Payment information:</strong> For featured listings, payment is processed by Dodo Payments. We do not store full payment details; Dodo Payments handles this per their privacy policy.</li>
            <li><strong>Usage data:</strong> We may use analytics (e.g., Plausible) to understand site traffic. This is aggregated and does not identify individuals.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use collected information to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Review and publish product listings</li>
            <li>Communicate with submitters about their submissions</li>
            <li>Send newsletter updates (if you opted in)</li>
            <li>Process featured listing payments</li>
            <li>Improve the Site and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. We Do Not Sell Your Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell, rent, or trade your personal information to third parties. Contact emails and newsletter emails are kept private and used only for the purposes described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may share data with: (a) service providers who assist us (e.g., hosting, email, payment processing), under strict confidentiality; (b) law enforcement when required by law; (c) in connection with a merger or sale of assets, with notice to users. Listed product information (name, URL, description, etc.) is publicly displayed on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain submission and contact data as long as the listing is active or as needed for business purposes. You may request deletion of your data by contacting us. Newsletter subscribers can unsubscribe at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use minimal cookies. Analytics may use cookies for aggregated traffic analysis. You can control cookies through your browser settings. We do not use third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent (where consent is the basis for processing)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            To exercise these rights, contact us. EU/EEA users may also lodge a complaint with their data protection authority.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Children</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Site is not intended for users under 16. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us to request deletion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Changes</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. Continued use of the Site after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related questions or to exercise your rights, contact us through the email provided in your submission or via contact methods listed on the Site.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex gap-4">
        <Link href="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
        <Link href="/refund" className="text-sm text-primary hover:underline">Refund Policy</Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Back to Home</Link>
      </div>
    </div>
  );
}
