import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ token: string }> };

export const metadata = buildMetadata({
  title: "Claim Listing",
  description: "Verify your listing claim on BuiltWithOpenClaw",
  path: "/claim",
  noIndex: true,
});

export default async function ClaimVerifyPage({ params }: Props) {
  const { token } = await params;
  if (!hasSupabase()) {
    return (
      <div className="container px-4 py-16 text-center">
        <p className="text-muted-foreground">Configure Supabase.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: claim } = await supabase
    .from("listing_claims")
    .select("id, listing_id, email")
    .eq("verification_token", token)
    .eq("status", "pending")
    .single();

  if (!claim) notFound();

  await supabase
    .from("listing_claims")
    .update({ status: "verified", verified_at: new Date().toISOString() })
    .eq("id", claim.id);

  await supabase
    .from("listings")
    .update({ claimed_by: claim.email })
    .eq("id", claim.listing_id);

  const { data: listing } = await supabase
    .from("listings")
    .select("name, slug")
    .eq("id", claim.listing_id)
    .single();

  return (
    <div className="container px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold">Listing claimed!</h1>
        <p className="text-muted-foreground mt-2">
          You&apos;ve successfully claimed {listing?.name ?? "this listing"}.
        </p>
        {listing && (
          <Link href={`/directory/${listing.slug}`} className="mt-6 inline-block">
            <Button>View listing</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
