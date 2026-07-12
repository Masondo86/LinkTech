// packages/risk-engine/src/detectors/url.ts

import type { AnalyzeResponse, URLRiskInput } from '../types';

export function evaluateURL(
  content: string,
  urlRiskData?: URLRiskInput | null
): AnalyzeResponse {
  let result: AnalyzeResponse = {
    riskLevel: 'Low',
    confidence: 28,
    reasons: [],
    recommendation: 'Still confirm URL legitimacy before sharing sensitive information.',
  };

  if (!urlRiskData) {
    return result;
  }

  const { riskScore, isMalicious, isPhishing, isSpam, isSuspicious, isParked } = urlRiskData;

  result.reasons.push(`External URL risk score: ${riskScore}`);

  if (riskScore >= 85) {
    result.riskLevel = 'High';
    result.confidence = Math.max(result.confidence, 90);
    result.recommendation = 'Do not visit – confirmed malicious URL.';
  } else if (riskScore >= 60) {
    result.riskLevel = 'High';
    result.confidence = Math.max(result.confidence, 75);
    result.recommendation = 'Suspicious – avoid entering credentials.';
  } else if (riskScore >= 30) {
    result.riskLevel = 'Medium';
    result.confidence = Math.max(result.confidence, 50);
    result.recommendation = 'Verify the official domain before clicking.';
  } else {
    result.confidence = Math.min(result.confidence + riskScore * 0.5, 100);
  }

  if (isMalicious) result.reasons.push('Domain is flagged as malicious.');
  if (isPhishing) result.reasons.push('This URL is a known phishing site.');
  if (isSpam) result.reasons.push('Domain associated with spam.');
  if (isSuspicious) result.reasons.push('Suspicious characteristics (new domain, low traffic).');
  if (isParked) result.reasons.push('This domain is parked and not actively used.');

  return result;
}