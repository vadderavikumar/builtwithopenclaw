import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = (formData.get("file") ?? formData.get("logo")) as File | null;
    const type = (formData.get("type") as string) ?? "logo";

    if (!file || !(file instanceof File) || !file.size) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "png";
    const path = `submissions/${randomUUID()}/${type}-${randomUUID()}.${ext}`;

    const supabase = createAdminClient();
    const buffer = await file.arrayBuffer();
    const { data: uploadData, error } = await supabase.storage
      .from("listings")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("listings").getPublicUrl(uploadData.path);
    return NextResponse.json({
      url: urlData.publicUrl,
      logoUrl: type === "logo" ? urlData.publicUrl : undefined,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
