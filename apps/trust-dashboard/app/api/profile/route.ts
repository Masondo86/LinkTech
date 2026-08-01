import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ---------- LOCAL TYPES (matching the original) ----------
type ScamExposure = {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  totalScans: number;
  recentScams: { input: string; riskLevel: string; date: string; reasons: string[] }[];
};

type DigitalFootprint = {
  breaches: any[];
  emailValid: boolean;
  phoneRisk: string | null;
  deviceScore: number | null;
  lastScanDate: string | null;
};

type TrustSignals = {
  presenceCount: number;
  negativeNews: number;
  positiveNews: number;
  negativeSearch: number;
  positiveSearch: number;
};

type BusinessVerification = {
  fscaRegistered: boolean;
  ncrRegistered: boolean;
  details: string;
};

// ---------- LOCAL HELPER FUNCTIONS (replacing @linktech/trust-engine) ----------
function calculateUnifiedRiskScore(
  scamExposure: ScamExposure,
  footprint: DigitalFootprint,
  trustSignals: TrustSignals,
  businessVerification: BusinessVerification
): { score: number; level: string } {
  // Simple heuristic – you can replace with your own logic later
  let score = 0;
  if (scamExposure.highRiskCount > 0) score += 30;
  if (scamExposure.mediumRiskCount > 0) score += 15;
  if (footprint.breaches && footprint.breaches.length > 0) score += 20;
  if (!footprint.emailValid) score += 10;
  if (trustSignals.negativeNews > 0) score += 10;
  if (!businessVerification.fscaRegistered) score += 5;
  if (!businessVerification.ncrRegistered) score += 5;
  score = Math.min(score, 100);

  let level = 'Low';
  if (score > 70) level = 'High';
  else if (score > 40) level = 'Medium';
  return { score, level };
}

function generateRecommendations(
  scamExposure: ScamExposure,
  footprint: DigitalFootprint,
  trustSignals: TrustSignals,
  businessVerification: BusinessVerification
): string[] {
  const recs: string[] = [];
  if (scamExposure.highRiskCount > 0) {
    recs.push('You have recent high‑risk scans. Review them and avoid engaging with those senders.');
  }
  if (footprint.breaches && footprint.breaches.length > 0) {
    recs.push('Your email appears in data breaches. Change your passwords and enable 2FA.');
  }
  if (!footprint.emailValid) {
    recs.push('Your email address may be invalid – check with your provider.');
  }
  if (trustSignals.negativeNews > 0) {
    recs.push('There is negative news about your digital identity. Investigate further.');
  }
  if (!businessVerification.fscaRegistered && !businessVerification.ncrRegistered) {
    recs.push('Consider registering your business with FSCA or NCR to build trust.');
  }
  if (recs.length === 0) {
    recs.push('Your digital profile looks clean. Keep up the good work!');
  }
  return recs;
}

// ---------- API ROUTE HANDLER ----------
export async function GET(req: Request) {
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
    // 1. Fetch digital footprint from Supabase (if any)
    const { data: footprintData, error: footprintError } = await supabase
      .from('digital_footprint_reports')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (footprintError) {
      console.error('[Trust Dashboard] Error fetching footprint:', footprintError);
    }

    // 2. Build mock data (replace with real data later)
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

    // 3. Calculate score and recommendations using local functions
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

    // 4. Return the response
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