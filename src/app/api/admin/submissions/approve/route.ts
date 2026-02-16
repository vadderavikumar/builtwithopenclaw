import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: sub, error: subErr } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (subErr || !sub) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (sub.status === "approved") {
      return NextResponse.json({ ok: true, message: "Submission already approved" });
    }

    if (sub.status !== "pending" && sub.status !== "rejected") {
      return NextResponse.json(
        { error: `Submission cannot be approved from status "${sub.status}"` },
        { status: 400 }
      );
    }

    const { data: existingListings } = await supabase
      .from("listings")
      .select("id, slug")
      .eq("url", sub.url)
      .order("created_at", { ascending: false })
      .limit(1);

    if ((existingListings ?? []).length > 0) {
      await supabase.from("submissions").update({ status: "approved" }).eq("id", id);
      return NextResponse.json({
        ok: true,
        message: "Submission approved (existing listing reused)",
        listingId: existingListings?.[0]?.id,
        listingSlug: existingListings?.[0]?.slug,
      });
    }

    const baseSlug = slugify(sub.name);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await supabase.from("listings").select("id").eq("slug", slug).single();
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const productType = ["Application", "Plugin", "Skill", "Extension"].includes(sub.product_type)
      ? sub.product_type
      : "Application";

    const { error: insertErr } = await supabase.from("listings").insert({
      slug,
      name: sub.name,
      url: sub.url,
      tagline: sub.tagline,
      description: sub.description,
      category: sub.category,
      product_type: productType,
      tags: sub.tags ?? [],
      pricing_type: sub.pricing_type,
      hosting_type: sub.hosting_type,
      github_url: sub.github_url,
      logo_url: sub.logo_url,
      screenshots: sub.screenshots ?? [],
      openclaw_proof: sub.openclaw_proof ?? null,
      status: "published",
      published_at: new Date().toISOString(),
      verified: false,
    });

    if (insertErr) {
      console.error(insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    await supabase.from("submissions").update({ status: "approved" }).eq("id", id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Approve failed" }, { status: 500 });
  }
}
