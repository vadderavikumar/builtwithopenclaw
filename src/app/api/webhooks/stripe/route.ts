import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient, hasSupabase } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe || !hasSupabase()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createAdminClient();
    await supabase.from("purchases").insert({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string | null,
      email: session.customer_email ?? session.customer_details?.email ?? "",
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: "paid",
      listing_id: session.metadata?.listing_id || null,
    });
  }

  return NextResponse.json({ received: true });
}
