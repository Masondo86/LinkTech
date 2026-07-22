// app/api/digital-footprint/create-checkout-session/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, phone, plan, deviceData } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Determine amount (in ZAR cents)
    const amount = plan === 'email' ? 2900 : 5900; // R29 or R59

    // Paystack secret key
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Callback URL (where user returns after payment)
    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/digital-footprint-scanner/results';

    // Prepare metadata
    const metadata = {
      email,
      phone: phone || '',
      plan,
      deviceData: deviceData ? JSON.stringify(deviceData) : '',
    };

    // Initialize transaction with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: callbackUrl,
        metadata,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Paystack initialization error:', data);
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
    }

    // Return the authorization URL and reference
    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error('Checkout session error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
