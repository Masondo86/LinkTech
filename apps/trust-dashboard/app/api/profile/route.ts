import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import {
  calculateUnifiedRiskScore,
  generateRecommendations,
  type ScamExposure,
  type DigitalFootprint,
  type TrustSignals,
  type BusinessVerification,
} from '@linktech/trust-engine';

// Supabase client (uses environment variables)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // 1. Fetch scam exposure (from scan_events)
    // Since scan_events doesn't store email, we can't filter by email.
    // For now, we'll return a generic sample or aggregate all scans.
    // In a real implementation, you'd need to link scans to users via a session or account.
    // For demo purposes, we'll return placeholder data.
    // Later, you can enhance by using a user ID or authentication.

    // 2. Fetch digital footprint (from digital_footprint_reports)
    const { data: footprintData, error: footprintError } = await supabase
      .from('digital_footprint_reports')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (footprintError) {
      console.error('Error fetching footprint:', footprintError);
    }

    // 3. Fetch business verification (from scan_events where type='business' and input_text matches domain)
    // For demo, we'll use placeholder.

    // 4. Trust signals – we can call the trust signal services (presence, news, search) from here,
    // but to keep the API fast, we can use cached data or mock it.

    // ---- MOCK DATA for demonstration ----
    const scamExposure: ScamExposure = {
      highRiskCount: 2,
      mediumRiskCount: 3,
      lowRiskCount: 5,
      totalScans: 10,
      recentScams: [
        {
          input: 'Your FNB account is suspended.',
          riskLevel: 'High',
          date: new Date().toISOString(),
          reasons: ['Urgent payment language', 'Impersonates authority'],
        },
      ],
    };

    const footprint: DigitalFootprint = {
      breaches: footprintData && footprintData.length > 0 ? footprintData[0].breaches || [] : [],
      emailValid: footprintData && footprintData.length > 0 ? footprintData[0].email_valid : true,
      phoneRisk: footprintData && footprintData.length > 0 ? footprintData[0].phone_risk : null,
      deviceScore: footprintData && footprintData.length > 0 ? footprintData[0].device_score : null,
      lastScanDate: footprintData && footprintData.length > 0 ? footprintData[0].created_at : null,
    };

    const trustSignals: TrustSignals = {
      presenceCount: 5,
      negativeNews: 1,
      positiveNews: 3,
      negativeSearch: 0,
      positiveSearch: 2,
    };

    const businessVerification: BusinessVerification = {
      fscaRegistered: false,
      ncrRegistered: true,
      details: 'NCRCP12345',
    };

    // Calculate unified score
    const { score, level } = calculateUnifiedRiskScore(
      scamExposure,
      footprint,
      trustSignals,
      businessVerification
    );

    const recommendations = generateRecommendations(
      scamExposure,
      footprint,
      trustSignals,
      businessVerification
    );

    return NextResponse.json({
      email,
      unifiedRiskScore: score,
      riskLevel: level,
      scamExposure,
      digitalFootprint: footprint,
      trustSignals,
      businessVerification,
      recommendations,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}