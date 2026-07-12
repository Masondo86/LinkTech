// packages/risk-engine/src/detectors/email.ts

import type { AnalyzeResponse, EmailRiskInput } from '../types';

export function evaluateEmail(
  content: string,
  emailRiskData?: EmailRiskInput | null
): AnalyzeResponse {
  let result: AnalyzeResponse = {
    riskLevel: 'Low',
    confidence: 15,
    reasons: ['Email address syntax passed, checking reputation...'],
    recommendation: 'Proceed with caution. Verify sender independently.',
  };

  if (!emailRiskData) {
    return result;
  }

  const { fraudScore, isDisposable, isFreeProvider, breached, deliverability } = emailRiskData;

  result.reasons.push(`External fraud score: ${fraudScore}`);

  if (fraudScore >= 85) {
    result.riskLevel = 'High';
    result.confidence = Math.max(result.confidence, 90);
    result.recommendation = 'High fraud risk – do not trust.';
  } else if (fraudScore >= 60) {
    result.riskLevel = 'High';
    result.confidence = Math.max(result.confidence, 75);
    result.recommendation = 'Suspicious email – avoid interaction.';
  } else if (fraudScore >= 30) {
    result.riskLevel = 'Medium';
    result.confidence = Math.max(result.confidence, 50);
    result.recommendation = 'Verify sender independently.';
  } else {
    result.confidence = Math.min(result.confidence + fraudScore * 0.5, 100);
  }

  if (isDisposable) {
    result.reasons.push('Disposable email address detected (often used by fraudsters).');
  }
  if (isFreeProvider) {
    result.reasons.push('Free email provider (e.g., Gmail, Yahoo).');
  }
  if (breached) {
    result.reasons.push('This email has been found in data breaches.');
  }
  if (deliverability === 'UNDELIVERABLE') {
    result.reasons.push('Email appears to be undeliverable.');
  }

  return result;
}