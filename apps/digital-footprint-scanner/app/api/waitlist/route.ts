// app/api/waitlist/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Waitlist] Missing Supabase credentials');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { email, tier, source } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { error } = await supabase.from('waitlist').insert({
      email,
      tier: tier || 'R59',
      source: source || 'digital-footprint-scanner',
      created_at: new Date(),
    });

    if (error) {
      console.error('[Waitlist] Insert error:', error);
      return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Waitlist] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
