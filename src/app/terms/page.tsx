export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="container px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-zinc dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          By using BuiltWithOpenClaw, you agree to these terms. We reserve the right to remove
          listings that violate our guidelines. Submissions are subject to manual review.
        </p>
      </div>
    </div>
  );
}
