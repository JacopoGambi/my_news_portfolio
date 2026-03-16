import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mockData';
import type { NewsItem, NewsCategory, ApiResponse } from '@/lib/types';

function categorizeNews(title: string, description: string): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/fed|bce|boj|bank of|tass[oi]|rate|monetar/)) return 'Banche Centrali';
  if (text.match(/earning|trimestral|ricavi|profitt|quarter|eps|revenue/)) return 'Earnings';
  if (text.match(/guerra|sanzioni|dazi|tariff|geopolit|elezioni|nato|conflict/)) return 'Geopolitica';
  if (text.match(/pil|gdp|inflazione|cpi|pmi|occupazione|disoccupazione|macro/)) return 'Macro';
  return 'Mercati';
}

function estimateImpact(title: string): 'high' | 'medium' | 'low' {
  const text = title.toLowerCase();
  if (text.match(/fed|bce|crash|crollo|record|guerra|sanzioni|emergenz|tass[oi]/)) return 'high';
  if (text.match(/calo|rialzo|trimestral|earning|petrolio|oro|crescita/)) return 'medium';
  return 'low';
}

async function fetchFromNewsAPI(): Promise<NewsItem[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=15&apiKey=${key}`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    if (data.status !== 'ok' || !data.articles) return [];
    return data.articles
      .filter((a: { title: string }) => a.title && a.title !== '[Removed]')
      .map((a: { title: string; description: string; source: { name: string }; url: string; publishedAt: string; urlToImage?: string }, i: number) => ({
        id: `newsapi-${i}`,
        title: a.title,
        description: (a.description || '').slice(0, 300),
        source: a.source?.name || 'NewsAPI',
        url: a.url || '#',
        publishedAt: a.publishedAt,
        category: categorizeNews(a.title, a.description || ''),
        impact: estimateImpact(a.title),
        imageUrl: a.urlToImage || undefined,
      }));
  } catch {
    return [];
  }
}

async function fetchFromFinnhub(): Promise<NewsItem[]> {
  const key = process.env.FINNHUB_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${key}`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, 10).map((a: { headline: string; summary: string; source: string; url: string; datetime: number; image?: string }, i: number) => ({
      id: `finnhub-${i}`,
      title: a.headline,
      description: (a.summary || '').slice(0, 300),
      source: a.source || 'Finnhub',
      url: a.url || '#',
      publishedAt: new Date(a.datetime * 1000).toISOString(),
      category: categorizeNews(a.headline, a.summary || ''),
      impact: estimateImpact(a.headline),
      imageUrl: a.image || undefined,
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  let isDemo = true;
  let news: NewsItem[] = [];

  const [newsApiResults, finnhubResults] = await Promise.all([
    fetchFromNewsAPI(),
    fetchFromFinnhub(),
  ]);

  if (newsApiResults.length > 0 || finnhubResults.length > 0) {
    isDemo = false;
    news = [...newsApiResults, ...finnhubResults];
    // Deduplica per titolo simile
    const seen = new Set<string>();
    news = news.filter(n => {
      const key = n.title.toLowerCase().slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Ordina per impatto e data
    const impactOrder = { high: 0, medium: 1, low: 2 };
    news.sort((a, b) => {
      const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
      if (impactDiff !== 0) return impactDiff;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } else {
    news = mockNews;
  }

  const response: ApiResponse<NewsItem[]> = {
    data: news,
    isDemo,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
