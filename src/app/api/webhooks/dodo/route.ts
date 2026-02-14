import { NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  if (!dodo || !hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await req.text();
  const webhookId = req.headers.get("webhook-id") ?? "";
  const webhookSignature = req.headers.get("webhook-signature") ?? "";
  const webhookTimestamp = req.headers.get("webhook-timestamp") ?? "";

  try {
    dodo.webhooks.unwrap(body, {
      headers: {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      },
    });
  } catch (err) {
    console.error("Dodo webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: { type?: string; data?: Record<string, unknown> };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.type === "payment.succeeded" && payload.data) {
    const data = payload.data as {
      payment_id?: string;
      total_amount?: number;
      currency?: string;
      metadata?: { listing_id?: string };
      customer?: { email?: string };
    };

    const supabase = createAdminClient();
    await supabase.from("purchases").insert({
      dodo_payment_id: data.payment_id ?? null,
      email: data.customer?.email ?? "",
      amount: data.total_amount ?? 0,
      currency: (data.currency ?? "usd").toLowerCase(),
      status: "paid",
      listing_id: data.metadata?.listing_id || null,
    });
  }

  return NextResponse.json({ received: true });
}
