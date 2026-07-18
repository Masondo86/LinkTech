// app/api/digital-footprint/payment-intent/route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId } = await req.json(); // 'price_R29' or 'price_R59'

  const amount = priceId === 'price_R29' ? 2900 : 5900; // in cents

  try {
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
