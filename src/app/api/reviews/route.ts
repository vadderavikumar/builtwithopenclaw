import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  if (!listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("listing_reviews")
    .select("*")
    .eq("listing_id", listingId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  const body = await request.json();
  const { listingId, authorName, authorEmail, rating, comment } = body;

  if (!listingId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "listingId and rating (1-5) required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("listing_reviews")
    .insert({
      listing_id: listingId,
      author_name: authorName || null,
      author_email: authorEmail || null,
      rating: Number(rating),
      comment: comment || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
