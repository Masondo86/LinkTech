import { ScamExposure, DigitalFootprint, TrustSignals, BusinessVerification } from './types';

export function calculateUnifiedRiskScore(
  scamExposure: ScamExposure,
  footprint: DigitalFootprint,
  trustSignals: TrustSignals,
  businessVerification?: BusinessVerification
): { score: number; level: 'Low' | 'Medium' | 'High' | 'Critical' } {
  let score = 0;

  // 1. Scam exposure (40% weight)
  let scamScore = 0;
  if (scamExposure.highRiskCount > 0) {
    scamScore += Math.min(scamExposure.highRiskCount * 10, 30);
  }
  if (scamExposure.mediumRiskCount > 0) {
    scamScore += Math.min(scamExposure.mediumRiskCount * 5, 10);
  }
  scamScore = Math.min(scamScore, 40);
  score += scamScore;

  // 2. Digital footprint (30% weight)
  let footprintScore = 0;
  if (footprint.breaches.length > 0) {
    footprintScore += Math.min(footprint.breaches.length * 10, 20);
  }
  if (!footprint.emailValid) {
    footprintScore += 5;
  }
  if (footprint.phoneRisk && footprint.phoneRisk > 50) {
    footprintScore += 5;
  }
  if (footprint.deviceScore && footprint.deviceScore > 50) {
    footprintScore += 5;
  }
  footprintScore = Math.min(footprintScore, 30);
  score += footprintScore;

  // 3. Trust signals (20% weight)
  let trustScore = 0;
  if (trustSignals.negativeNews > 0) {
    trustScore += Math.min(trustSignals.negativeNews * 5, 10);
  }
  if (trustSignals.negativeSearch > 0) {
    trustScore += Math.min(trustSignals.negativeSearch * 3, 10);
  }
  trustScore = Math.min(trustScore, 20);
  score += trustScore;

  // 4. Business verification (10% weight) – if available
  if (businessVerification) {
    let bizScore = 0;
    if (!businessVerification.fscaRegistered) {
      bizScore += 5;
    }
    if (!businessVerification.ncrRegistered) {
      bizScore += 5;
    }
    bizScore = Math.min(bizScore, 10);
    score += bizScore;
  }

  score = Math.min(100, Math.round(score));

  let level: 'Low' | 'Medium' | 'High' | 'Critical';
  if (score >= 80) level = 'Critical';
  else if (score >= 60) level = 'High';
  else if (score >= 40) level = 'Medium';
  else level = 'Low';

  return { score, level };
}

export function generateRecommendations(
  scamExposure: ScamExposure,
  footprint: DigitalFootprint,
  trustSignals: TrustSignals,
  businessVerification?: BusinessVerification
): string[] {
  const recommendations: string[] = [];

  // Scam exposure recommendations
  if (scamExposure.highRiskCount > 0) {
    recommendations.push(`You have ${scamExposure.highRiskCount} high‑risk scam detections. Review the recent scans and avoid engaging with those messages.`);
  }
  if (scamExposure.totalScans === 0) {
    recommendations.push('You have not scanned any messages yet. Use our free scam checker to understand your exposure.');
  }

  // Digital footprint recommendations
  if (footprint.breaches.length > 0) {
    recommendations.push(`Your email was found in ${footprint.breaches.length} data breaches. Change your password and enable two‑factor authentication immediately.`);
  }
  if (!footprint.emailValid) {
    recommendations.push('Your email appears invalid. Use a valid email address for better security.');
  }
  if (footprint.phoneRisk && footprint.phoneRisk > 50) {
    recommendations.push('Your phone number has a high spam/fraud risk. Consider using a secondary number for sensitive accounts.');
  }
  if (footprint.deviceScore && footprint.deviceScore > 50) {
    recommendations.push('Your device has security vulnerabilities. Update your browser, enable cookies, and avoid using VPNs for this site.');
  }

  // Trust signals recommendations
  if (trustSignals.negativeNews > 0) {
    recommendations.push(`We found ${trustSignals.negativeNews} negative news mentions for your domain. Monitor your reputation and consider PR actions.`);
  }
  if (trustSignals.negativeSearch > 0) {
    recommendations.push(`We found ${trustSignals.negativeSearch} negative search results. Address any false information or improve your online presence.`);
  }
  if (trustSignals.presenceCount === 0) {
    recommendations.push('You have no visible social presence. Consider creating professional profiles to establish trust.');
  }

  // Business recommendations
  if (businessVerification) {
    if (!businessVerification.fscaRegistered) {
      recommendations.push('Your business is not registered with the FSCA. This is required for financial services.');
    }
    if (!businessVerification.ncrRegistered) {
      recommendations.push('Your business is not registered with the NCR. Credit providers must be registered.');
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Your digital footprint looks clean. Stay safe by regularly monitoring your accounts and updating passwords.');
  }

  return recommendations;
}