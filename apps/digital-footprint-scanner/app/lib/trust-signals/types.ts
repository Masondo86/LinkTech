// app/lib/trust-signals/types.ts

export interface PresenceSignal {
  platform: string;       // e.g., "github", "linkedin"
  found: boolean;
  confidence: number;     // 0–100 (how certain we are)
  profileUrl?: string;    // optional – the URL we checked
  error?: string;         // optional – if something went wrong
}

export interface PresenceRequest {
  username: string;
  platforms?: string[];   // if omitted, check all defined
}

export interface PresenceResponse {
  username: string;
  signals: PresenceSignal[];
  foundCount: number;
  checkedCount: number;
}
// app/lib/trust-signals/types.ts

// ... (existing PresenceSignal, PresenceRequest, PresenceResponse types) ...

export interface NewsSignal {
  title: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  url: string;
  publishedDate: string;
  category?: string; // e.g., "Scam Warning", "Press Release"
}

export interface NewsRequest {
  query: string;
  limit?: number; // max articles to return, default 20
}

export interface NewsResponse {
  query: string;
  total: number;
  signals: NewsSignal[];
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  riskImpact: 'low' | 'medium' | 'high';
}
