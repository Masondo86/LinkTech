// app/services/trust-signals/news.ts

import { XMLParser } from 'fast-xml-parser';
import { NewsSignal, NewsResponse } from '@/app/lib/trust-signals/types';
import { NEWS_SOURCES } from '@/app/lib/trust-signals/news-sources';

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Keyword lists for sentiment (v1)
const NEGATIVE_KEYWORDS = [
  'scam', 'fraud', 'complaint', 'lawsuit', 'investigation', 'warning',
  'fake', 'phishing', 'breach', 'attack', 'violation', 'penalty',
  'cease', 'desist', 'fine', 'sue', 'court', 'judge', 'guilty',
];
const POSITIVE_KEYWORDS = [
  'award', 'launch', 'success', 'growth', 'expansion', 'innovation',
  'partnership', 'acquisition', 'new product', 'milestone', 'achievement',
];

function classifySentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lower = text.toLowerCase();
  let score = 0;
  for (const word of NEGATIVE_KEYWORDS) {
    if (lower.includes(word)) score--;
  }
  for (const word of POSITIVE_KEYWORDS) {
    if (lower.includes(word)) score++;
  }
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

function categoriseArticle(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('scam') || lower.includes('phishing')) return 'Scam Warning';
  if (lower.includes('fraud') || lower.includes('theft')) return 'Fraud';
  if (lower.includes('complaint') || lower.includes('consumer protection')) return 'Consumer Complaint';
  if (lower.includes('regulator') || lower.includes('fine') || lower.includes('penalty')) return 'Regulatory Notice';
  if (lower.includes('lawsuit') || lower.includes('sues') || lower.includes('court')) return 'Lawsuit';
  if (lower.includes('launch') || lower.includes('introduces')) return 'Press Release';
  return undefined;
}

export async function fetchNews(query: string, limit: number = 20): Promise<NewsResponse> {
  // Use the first source (Google News)
  const source = NEWS_SOURCES[0];
  const url = source.fetchUrl(query, limit);

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheLinkDigital/1.0)',
      },
    }, 8000);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const xml = await response.text();
    const rawSignals = await source.parseResponse(xml);

    // Classify each article with sentiment and category
    const classifiedSignals: NewsSignal[] = rawSignals.slice(0, limit).map((signal) => {
      const fullText = `${signal.title} ${signal.url}`;
      const sentiment = classifySentiment(fullText);
      const category = categoriseArticle(fullText);
      return {
        ...signal,
        sentiment,
        category,
      };
    });

    const positive = classifiedSignals.filter(s => s.sentiment === 'positive').length;
    const neutral = classifiedSignals.filter(s => s.sentiment === 'neutral').length;
    const negative = classifiedSignals.filter(s => s.sentiment === 'negative').length;

    let riskImpact: 'low' | 'medium' | 'high' = 'low';
    if (negative >= 5) riskImpact = 'high';
    else if (negative >= 2) riskImpact = 'medium';

    return {
      query,
      total: classifiedSignals.length,
      signals: classifiedSignals,
      positiveCount: positive,
      neutralCount: neutral,
      negativeCount: negative,
      riskImpact,
    };
  } catch (error) {
    console.error('[News Engine] Error fetching news:', error);
    return {
      query,
      total: 0,
      signals: [],
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      riskImpact: 'low',
    };
  }
}
