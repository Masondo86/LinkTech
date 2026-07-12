export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface AnalyzeResponse {
  riskLevel: RiskLevel;
  confidence: number;
  reasons: string[];
  recommendation: string;
  spamReportCount?: number;
}

export interface NLPAnalysis {
  riskBoost: number;
  reasons: string[];
  features: {
    hasUrgency: boolean;
    hasFear: boolean;
    hasAuthority: boolean;
    sentenceCount: number;
    questionCount: number;
  };
}