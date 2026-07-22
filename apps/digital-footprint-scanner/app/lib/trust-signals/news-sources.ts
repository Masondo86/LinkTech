// app/lib/trust-signals/news-sources.ts

import { XMLParser } from 'fast-xml-parser';
import { NewsSignal } from './types';   // ✅ added missing import

export interface NewsSource {
  name: string;
  fetchUrl: (query: string, limit: number) => string;
  parseResponse: (xml: string) => Promise<NewsSignal[]>;
}

async function parseGoogleNewsRss(xml: string): Promise<NewsSignal[]> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item || [];
  const articleList = Array.isArray(items) ? items : [items];

  return articleList.slice(0, 20).map((item: any) => {
    const title = item.title || '';
    const link = item.link || '';
    const pubDate = item.pubDate || new Date().toISOString();
    const source = item.source?._text || 'Unknown';
    return {
      title,
      source,
      sentiment: 'neutral',
      url: link,
      publishedDate: pubDate,
      category: undefined,
    };
  });
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'Google News',
    fetchUrl: (query, limit) =>
      `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-ZA&gl=ZA&ceid=ZA:en`,
    parseResponse: parseGoogleNewsRss,
  },
];
