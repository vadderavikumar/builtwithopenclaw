import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      name,
      url,
      tagline,
      description,
      category,
      product_type,
      tags,
      pricing_type,
      hosting_type,
      github_url,
      contact_email,
      logo_url,
      screenshots,
      openclaw_proof,
    } = body;

    if (!name || !url || !tagline || !description || !category || !pricing_type || !hosting_type || !contact_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validProductTypes = ["Application", "Plugin", "Skill", "Extension"];
    const pt = validProductTypes.includes(product_type) ? product_type : "Application";

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("submissions").insert({
      name,
      url,
      tagline,
      description,
      category,
      product_type: pt,
      tags: Array.isArray(tags) ? tags : [],
      pricing_type,
      hosting_type,
      github_url: github_url || null,
      contact_email,
      logo_url: logo_url || null,
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      openclaw_proof: openclaw_proof || null,
      status: "pending",
    }).select("id").single();

    if (error) {
      console.error("Submit error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
