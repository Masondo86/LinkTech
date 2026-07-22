// app/api/digital-footprint/payment-intent/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('[Payment Intent] Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);

    const amount = priceId === 'price_R29' ? 2900 : 5900; // in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'zar',
      metadata: { type: priceId === 'price_R29' ? 'email_scan' : 'full_scan' },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: 'Payment intent creation failed' }, { status: 500 });
  }
}
