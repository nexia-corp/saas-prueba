import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const plan = body.plan as keyof typeof PLANS;
  if (plan !== "PRO" && plan !== "AGENCY") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planData = PLANS[plan];
  if (!planData.priceId) {
    return NextResponse.json({ error: "Plan not configured" }, { status: 400 });
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id as string },
  });

  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name || undefined,
      metadata: { userId: session.user.id as string },
    });
    customerId = customer.id;

    await db.subscription.upsert({
      where: { userId: session.user.id as string },
      update: { stripeCustomerId: customerId },
      create: {
        userId: session.user.id as string,
        stripeCustomerId: customerId,
        plan: "FREE",
        status: "ACTIVE",
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: planData.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=billing`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId: session.user.id as string, plan },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
