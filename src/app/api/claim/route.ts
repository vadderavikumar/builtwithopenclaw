import { NextResponse } from "next/server";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  if (!hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const { listingId, email } = await req.json();
    if (!listingId || !email) {
      return NextResponse.json({ error: "listingId and email required" }, { status: 400 });
    }

    const token = randomUUID();
    const supabase = createAdminClient();
    await supabase.from("listing_claims").insert({
      listing_id: listingId,
      email,
      verification_token: token,
      status: "pending",
    });

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${origin}/claim/${token}`;

    if (resend) {
      await resend.emails.send({
        from: "BuiltWithOpenClaw <noreply@builtwithopenclaw.com>",
        to: email,
        subject: "Verify your listing claim",
        html: `Click to verify: <a href="${verifyUrl}">${verifyUrl}</a>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }
}
