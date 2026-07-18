export function calculateExternalRiskScore(breachCount: number, isEmailValid: boolean, phoneRiskScore?: number): number {
  let score = 0;
  if (breachCount > 0) score += Math.min(breachCount * 10, 50);
  if (!isEmailValid) score += 30;
  if (phoneRiskScore && phoneRiskScore > 50) score += phoneRiskScore * 0.4;
  return Math.min(100, score);
}

export function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}
