// packages/risk-engine/src/detectors/phone.ts

import type { AnalyzeResponse, PhoneRiskInput } from '../types';

export function evaluatePhone(
  content: string,
  phoneRiskData?: PhoneRiskInput | null
): AnalyzeResponse {
  // Base result from simple number check (could be passed as well)
  let result: AnalyzeResponse = {
    riskLevel: 'Low',
    confidence: 24,
    reasons: ['Phone number not in known scam list'],
    recommendation: 'Stay cautious and avoid sharing confidential information.',
  };

  if (!phoneRiskData) {
    return result;
  }

  const { riskScore, carrier, isActive, isVoip } = phoneRiskData;

  // Use riskScore to adjust confidence and risk level
  result.reasons.push(`External reputation score: ${riskScore}`);

  if (riskScore >= 85) {
    result.riskLevel = 'High';
    result.confidence = Math.max(result.confidence, 90);
    result.recommendation = 'Highly suspicious – do not engage.';
  } else if (riskScore >= 60) {
    result.riskLevel = 'High';
    result.confidence = Math.max(result.confidence, 75);
    result.recommendation = 'Suspicious – proceed with caution.';
  } else if (riskScore >= 30) {
    result.riskLevel = 'Medium';
    result.confidence = Math.max(result.confidence, 50);
    result.recommendation = 'Verify the number through official channels.';
  } else {
    result.confidence = Math.min(result.confidence + riskScore * 0.5, 100);
  }

  // Add extra details
  if (isActive === false) {
    result.reasons.push('Phone number appears to be inactive.');
  }
  if (isVoip) {
    result.reasons.push('VoIP number detected – may be a burner or disposable.');
  }
  if (carrier) {
    result.reasons.push(`Carrier: ${carrier}`);
  }

  return result;
}