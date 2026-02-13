export const metadata = {
  title: "Refund Policy",
};

export default function RefundPage() {
  return (
    <div className="container px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Refund Policy</h1>
      <div className="prose prose-zinc dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          Featured slot purchases are refundable if we cannot assign your slot within 7 days, or if
          your listing is rejected. Contact us to request a refund.
        </p>
      </div>
    </div>
  );
}
