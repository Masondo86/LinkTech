import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { email, phone, plan, deviceData } = await req.json();

    // Determine price ID (you'll need to create these in Stripe Dashboard)
    const priceId = plan === 'email'
      ? process.env.STRIPE_PRICE_EMAIL_SCAN
      : process.env.STRIPE_PRICE_FULL_SCAN;

    if (!priceId) {
      throw new Error('Missing price ID for the selected plan.');
    }

    // Store deviceData temporarily (metadata limited to 500 characters)
    // We'll store it in a database after payment, but for now we'll include in metadata.
    const deviceSummary = deviceData ? {
      userAgent: deviceData.userAgent?.substring(0, 100),
      platform: deviceData.platform,
      timezone: deviceData.timezone,
      screen: deviceData.screenResolution,
    } : {};

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // or 'payment' for one-time
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/digital-footprint-scanner/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/digital-footprint-scanner/check`,
      metadata: {
        email,
        phone: phone || '',
        plan,
        deviceSummary: JSON.stringify(deviceSummary),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Checkout session error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 });
  }
}
