// app/api/digital-footprint/scan/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import {
  evaluateEmail,
  evaluatePhone,
  evaluateURL,
} from '@linktech/risk-engine';

import { getAbstractPhoneReputation } from '@/app/services/abstractPhone';
import { getAbstractEmailReputation } from '@/app/services/abstractEmail';
import { checkEmailBreaches } from '@/app/services/hibp';
import { validateEmail } from '@/app/services/email-validation';
import { checkPresence } from '@/app/services/trust-signals/presence';
import { fetchNews } from '@/app/services/trust-signals/news';
import { searchWeb } from '@/app/services/trust-signals/search';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: 'Missing payment reference.' }, { status: 400 });
    }

    // 1. Verify payment with Paystack
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not set');
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 402 });
    }

    // 2. Extract metadata
    const metadata = verifyData.data.metadata || {};
    const email = metadata.email || '';
    const phone = metadata.phone || '';
    const plan = metadata.plan || 'email';
    const deviceSummary = metadata.deviceData ? JSON.parse(metadata.deviceData) : null;

    // 3. External scans
    const breachData = await checkEmailBreaches(email);
    const breaches = breachData.breaches || [];
    const emailValidation = await validateEmail(email);
    const emailValid = emailValidation?.is_valid || false;

    let phoneRisk: any = null;
    if (phone) {
      phoneRisk = await getAbstractPhoneReputation(phone);
    }

    // 4. Device scan (if full plan)
    let deviceScore = 0;
    let deviceIssues: string[] = [];
    if (plan === 'full' && deviceSummary) {
      const deviceRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/digital-footprint/device-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceSummary),
      });
      const deviceData = await deviceRes.json();
      deviceScore = deviceData.score || 0;
      deviceIssues = deviceData.issues || [];
    }

    // 5. Trust signals
    let trustSignals = {
      presenceCount: 0,
      negativeNews: 0,
      negativeSearch: 0,
    };
    try {
      const username = email.split('@')[0];
      const domain = email.split('@')[1];
      const presence = await checkPresence(username);
      trustSignals.presenceCount = presence.foundCount || 0;
      if (domain) {
        const news = await fetchNews(domain);
        trustSignals.negativeNews = news.negativeCount || 0;
        if (news.total === 0) {
          const searchResults = await searchWeb(domain);
          trustSignals.negativeSearch = searchResults.filter(r => r.sentiment === 'negative').length || 0;
        }
      }
    } catch (err) {
      console.warn('[DFS] Trust signal integration failed:', err);
    }

    // 6. Unified risk score
    const externalScore = calculateExternalRiskScore(breaches.length, emailValid, phoneRisk?.riskScore);
    let finalScore = externalScore * 0.5;
    if (plan === 'full') {
      finalScore += deviceScore * 0.3;
    }
    const trustPenalty = Math.min((trustSignals.negativeNews + trustSignals.negativeSearch) * 5, 20);
    finalScore += trustPenalty;
    finalScore = Math.min(100, Math.round(finalScore));
    const riskLevel = getRiskLevel(finalScore);

    // 7. Recommendations
    const recommendations = [];
    if (breaches.length > 0) {
      recommendations.push(`Change your password for ${breaches.slice(0, 3).join(', ')} and enable 2FA.`);
    }
    if (!emailValid) {
      recommendations.push('Your email appears invalid or undeliverable – consider using a different address.');
    }
    if (phoneRisk && phoneRisk.riskScore > 60) {
      recommendations.push('Your phone number has a high spam/fraud risk – consider using a secondary number.');
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

    // 8. Store result
    await supabase.from('digital_footprint_reports').insert({
      email,
      phone: phone || null,
      plan,
      external_score: externalScore,
      device_score: deviceScore,
      final_score: finalScore,
      risk_level: riskLevel,
      breaches,
      recommendations,
      trust_signals: trustSignals,
      created_at: new Date(),
    });

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
    console.error('[DFS] Scan error:', err);
    return NextResponse.json({ error: 'Failed to complete scan.' }, { status: 500 });
  }
}

function calculateExternalRiskScore(breachCount: number, isEmailValid: boolean, phoneRiskScore?: number): number {
  let score = 0;
  if (breachCount > 0) score += Math.min(breachCount * 10, 50);
  if (!isEmailValid) score += 30;
  if (phoneRiskScore && phoneRiskScore > 50) score += phoneRiskScore * 0.4;
  return Math.min(100, score);
}

function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}
