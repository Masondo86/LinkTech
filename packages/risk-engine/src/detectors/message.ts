import type { AnalyzeResponse } from '../types';
import { analyzeMessageNLP, detectScamKeywords } from '../nlp';

export function evaluateMessage(content: string): AnalyzeResponse {
  const { matchedFlags, count } = detectScamKeywords(content);

  let result: AnalyzeResponse;

  if (count >= 3) {
    result = {
      riskLevel: 'High',
      confidence: 82,
      reasons: [
        'Requests personal information',
        'Uses urgent payment language',
        'Similar to known scam patterns',
      ],
      recommendation: 'Do not respond. Contact your medical aid directly.',
    };
  } else if (count > 0) {
    result = {
      riskLevel: 'Medium',
      confidence: 62,
      reasons: ['Contains pressure or verification language', 'May be a phishing attempt'],
      recommendation: 'Do not share details yet. Verify sender through official channels.',
    };
  } else {
    result = {
      riskLevel: 'Low',
      confidence: 22,
      reasons: ['No strong scam keywords detected'],
      recommendation: 'Proceed carefully and verify if unsure.',
    };
  }

  const nlpAnalysis = analyzeMessageNLP(content);
  if (nlpAnalysis.riskBoost > 0) {
    result.reasons.push(...nlpAnalysis.reasons);
    result.confidence = Math.min(result.confidence + nlpAnalysis.riskBoost, 100);
    if (result.confidence >= 70) result.riskLevel = 'High';
    else if (result.confidence >= 40) result.riskLevel = 'Medium';
  }

  return result;
}