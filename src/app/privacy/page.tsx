export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-zinc dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          We collect email addresses for submissions and newsletter signups. We do not sell your
          data. Contact emails are kept private and used only for review communication.
        </p>
      </div>
    </div>
  );
}
