import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { data: listing } = await supabase.from("listings").select("status").eq("id", id).single();

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newStatus = listing.status === "published" ? "unlisted" : "published";
  await supabase
    .from("listings")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.redirect(new URL("/admin/listings", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
