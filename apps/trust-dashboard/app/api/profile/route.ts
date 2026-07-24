// apps/trust-dashboard/app/api/profile/route.ts
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

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Initialize Supabase client inside the handler
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Trust Dashboard] Missing Supabase credentials');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // 1. Fetch scam exposure (from scan_events)
    // Note: This will be generic for now as scan_events doesn't store email.
    // For demonstration, we'll return placeholder data.

    // 2. Fetch digital footprint (from digital_footprint_reports)
    const { data: footprintData, error: footprintError } = await supabase
      .from('digital_footprint_reports')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (footprintError) {
      console.error('[Trust Dashboard] Error fetching footprint:', footprintError);
    }

    // ---- MOCK DATA for demonstration (updated with correct property names) ----
    const scamExposure: ScamExposure = {
      highRiskCount: 2,
      mediumRiskCount: 3,
      lowRiskCount: 5,
      totalScans: 10,
      recentScams: [ // ✅ Fixed property name
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
    console.error('[Trust Dashboard] Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}