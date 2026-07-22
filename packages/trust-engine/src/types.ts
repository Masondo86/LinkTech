// Types for the Digital Trust Profile

export interface ScamExposure {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  totalScans: number;
  recentScams: Array<{
    input: string;
    riskLevel: string;
    date: string;
    reasons: string[];
  }>;
}

export interface DigitalFootprint {
  breaches: string[];
  emailValid: boolean;
  phoneRisk: number | null;
  deviceScore: number | null;
  lastScanDate: string | null;
}

export interface TrustSignals {
  presenceCount: number;
  negativeNews: number;
  positiveNews: number;
  negativeSearch: number;
  positiveSearch: number;
}

export interface BusinessVerification {
  fscaRegistered: boolean;
  ncrRegistered: boolean;
  details?: string;
}

export interface TrustProfile {
  email: string;
  unifiedRiskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  scamExposure: ScamExposure;
  digitalFootprint: DigitalFootprint;
  trustSignals: TrustSignals;
  businessVerification?: BusinessVerification;
  recommendations: string[];
  generatedAt: string;
}

export interface ProfileRequest {
  email: string;
}