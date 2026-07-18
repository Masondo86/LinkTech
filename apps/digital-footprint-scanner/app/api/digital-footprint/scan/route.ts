// app/api/digital-footprint/scan/route.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { checkEmailBreaches } from '@/app/services/hibp';
import { validateEmail } from '@/app/services/email-validation';
import { getSEONPhoneReputation } from '@/app/services/seonPhone'; // or IPQS
import { getSEONEmailReputation } from '@/app/services/seonEmail';   // or IPQS
import { checkPresence } from '@/app/services/trust-signals/presence';
import { fetchNews } from '@/app/services/trust-signals/news';
import { searchWeb } from '@/app/services/trust-signals/search';
import { calculateExternalRiskScore, getRiskLevel } from '@/lib/digital-footprint-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for writing scan results
);

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID.' }, { status: 400 });
    }

    // 1. Retrieve Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed or invalid session.' }, { status: 402 });
    }

    const metadata = session.metadata || {};
    const email = metadata.email || '';
    const phone = metadata.phone || '';
    const plan = metadata.plan || 'email';
    const deviceSummary = metadata.deviceSummary ? JSON.parse(metadata.deviceSummary) : null;

    // 2. Run external scans
    let externalScore = 0;
    let breaches: string[] = [];
    let emailValid = false;
    let phoneRisk: any = null;
    let emailFraudScore = 0;

    // Email breach check (HIBP)
    const breachData = await checkEmailBreaches(email);
    breaches = breachData.breaches || [];
    emailValid = breachData.valid || false;

    // Email reputation (SEON/IPQS)
    const emailRep = await getSEONEmailReputation(email);
    if (emailRep) {
      emailFraudScore = emailRep.fraudScore;
    }

    // Phone reputation (if provided)
    if (phone) {
      phoneRisk = await getSEONPhoneReputation(phone);
    }

    // Compute external risk score (0-100)
    externalScore = calculateExternalRiskScore(breaches.length, emailValid, phoneRisk?.riskScore);

    // 3. Device scan (if full plan)
    let deviceScore = 0;
    let deviceIssues: string[] = [];
    if (plan === 'full' && deviceSummary) {
      // Call device scan API (or run logic inline)
      const deviceRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/digital-footprint/device-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceSummary),
      });
      const deviceData = await deviceRes.json();
      deviceScore = deviceData.score || 0;
      deviceIssues = deviceData.issues || [];
    }

    // 4. Trust Signal Integration (social presence, news, search)
    let trustSignals = {
      presenceCount: 0,
      negativeNews: 0,
      negativeSearch: 0,
    };

    try {
      // Social presence
      const username = email.split('@')[0];
      const presence = await checkPresence(username);
      trustSignals.presenceCount = presence.foundCount || 0;

      // News and search for domain
      const domain = email.split('@')[1];
      if (domain) {
        const news = await fetchNews(domain);
        trustSignals.negativeNews = news.negativeCount || 0;

        if (news.total === 0) {
          const searchResults = await searchWeb(domain);
          trustSignals.negativeSearch = searchResults.filter(r => r.sentiment === 'negative').length || 0;
        }
      }
    } catch (err) {
      console.warn('Trust signal integration failed:', err);
      // Proceed without trust signals
    }

    // 5. Unified risk score (weighted)
    // Weighting: external 60%, device 20%, trust signals 20%
    let finalScore = externalScore * 0.6;
    if (plan === 'full') {
      finalScore += deviceScore * 0.2;
    }
    // Trust signals: each negative news/search adds 5 points, capped at 20
    const trustPenalty = Math.min((trustSignals.negativeNews + trustSignals.negativeSearch) * 5, 20);
    finalScore += trustPenalty;
    finalScore = Math.min(100, Math.round(finalScore));

    const riskLevel = getRiskLevel(finalScore);

    // 6. Generate recommendations
    const recommendations = [];
    if (breaches.length > 0) {
      recommendations.push(`Change your password for ${breaches.slice(0, 3).join(', ')} and enable 2FA.`);
    }
    if (!emailValid) {
      recommendations.push('Your email appears invalid or undeliverable – consider using a different address.');
    }
    if (phoneRisk && phoneRisk.riskScore > 60) {
      recommendations.push('Your phone number has a high spam/fraud risk – consider using a secondary number for sensitive accounts.');
    }
    if (trustSignals.negativeNews > 0) {
      recommendations.push(`Your email domain has ${trustSignals.negativeNews} negative news mentions – monitor your reputation.`);
    }
    if (trustSignals.negativeSearch > 0) {
      recommendations.push(`We found ${trustSignals.negativeSearch} negative search results for your domain.`);
    }
    if (plan === 'full' && deviceScore > 50) {
      recommendations.push('Your device has security issues – update your browser, enable cookies, and avoid using VPNs for this site.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Your digital footprint looks clean. Stay safe by regularly updating passwords and monitoring your accounts.');
    }

    // 7. Store scan result in Supabase (optional, for history)
    await supabase.from('digital_footprint_reports').insert({
      email,
      phone: phone || null,
      plan,
      external_score: externalScore,
      device_score: deviceScore,
      final_score: finalScore,
      risk_level: riskLevel,
      breaches: breaches,
      recommendations,
      trust_signals: trustSignals,
      created_at: new Date(),
    });

    // 8. Return result
    return NextResponse.json({
      email,
      phone: phone || undefined,
      plan,
      externalScore,
      deviceScore,
      finalScore,
      riskLevel,
      breaches,
      emailValid,
      phoneRisk: phoneRisk?.riskScore || null,
      deviceIssues,
      trustSignals,
      recommendations,
    });
  } catch (err) {
    console.error('Digital Footprint scan error:', err);
    return NextResponse.json({ error: 'Failed to complete scan.' }, { status: 500 });
  }
}
