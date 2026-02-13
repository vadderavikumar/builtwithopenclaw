import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function GetFeaturedSuccessPage() {
  return (
    <div className="container px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Payment successful!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. We&apos;ll assign your featured slot shortly. You&apos;ll receive a confirmation email.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Link href="/directory">
            <Button className="w-full">Browse Directory</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
