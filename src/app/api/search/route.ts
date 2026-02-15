import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const pattern = `%${q}%`;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, name, slug, tagline, category, product_type")
    .eq("status", "published")
    .or(`name.ilike.${pattern},tagline.ilike.${pattern},description.ilike.${pattern}`)
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
