import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const FEATURED_PRICE_ID = process.env.STRIPE_FEATURED_PRICE_ID;

export async function POST(req: Request) {
  if (!stripe || !FEATURED_PRICE_ID) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const { email, listingId } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: FEATURED_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { listing_id: listingId ?? "" },
      success_url: `${origin}/get-featured/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/get-featured`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
