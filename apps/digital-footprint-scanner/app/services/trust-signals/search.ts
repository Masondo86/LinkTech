// app/services/trust-signals/search.ts

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

async function fetchWithTimeout(url: string, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Query Google Custom Search API for a given term.
 * Returns up to 10 results with sentiment classification.
 */
export async function searchWeb(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX;

  if (!apiKey || !cx) {
    console.warn('[Search] Missing API key or CX. Skipping search.');
    return [];
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=10`;

  try {
    const response = await fetchWithTimeout(url, 5000);
    if (!response.ok) {
      console.error(`[Search] HTTP error ${response.status}`);
      return [];
    }

    const data = await response.json();
    const items = data.items || [];

    // Simple sentiment classification based on snippet/title
    const negativeKeywords = ['scam', 'fraud', 'complaint', 'lawsuit', 'warning', 'fake', 'phishing', 'breach', 'attack'];
    const positiveKeywords = ['award', 'success', 'growth', 'innovation', 'partnership', 'milestone', 'achievement'];

    return items.map((item: any) => {
      const text = `${item.title} ${item.snippet}`.toLowerCase();
      let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
      let score = 0;
      for (const word of negativeKeywords) if (text.includes(word)) score--;
      for (const word of positiveKeywords) if (text.includes(word)) score++;
      if (score > 0) sentiment = 'positive';
      else if (score < 0) sentiment = 'negative';

      return {
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        source: item.displayLink || 'Unknown',
        sentiment,
      };
    });
  } catch (err) {
    console.error('[Search] Error:', err);
    return [];
  }
}