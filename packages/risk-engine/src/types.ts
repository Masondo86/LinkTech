// packages/risk-engine/src/types.ts

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

// --- New types for phone/email/URL ---

export interface PhoneRiskInput {
  riskScore: number;    // from external API (e.g., Abstract, SEON)
  carrier?: string;
  isActive?: boolean;
  isVoip?: boolean;
  // ... other fields you might receive
}

export interface EmailRiskInput {
  fraudScore: number;
  isDisposable?: boolean;
  isFreeProvider?: boolean;
  breached?: boolean;
  deliverability?: string;
}

export interface URLRiskInput {
  riskScore: number;
  isMalicious?: boolean;
  isPhishing?: boolean;
  isSpam?: boolean;
  isSuspicious?: boolean;
  isParked?: boolean;
}