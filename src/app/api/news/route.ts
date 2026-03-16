import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mockData';
import type { NewsItem, NewsCategory, ApiResponse } from '@/lib/types';

function categorizeNews(title: string, description: string): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();
  // Banche Centrali
  if (text.match(/\b(fed|bce|ecb|boj|bank of|tass[oi]|rates?|monetar|interest rate|powell|lagarde|central bank)\b/)) return 'Banche Centrali';
  // Earnings
  if (text.match(/\b(earning|trimestral|ricavi|profitt|quarter|eps|revenue|results|utili|bilancio|guidance)\b/)) return 'Earnings';
  // Geopolitica
  if (text.match(/\b(guerra|war|sanzioni|sanctions|dazi|tariff|geopolit|elezioni|election|nato|conflict|iran|russia|china|cina|trump|missile|military|militare)\b/)) return 'Geopolitica';
  // Macro
  if (text.match(/\b(pil|gdp|inflazione|inflation|cpi|pmi|occupazione|unemployment|jobs|disoccupazione|macro|retail sales|consumer)\b/)) return 'Macro';
  return 'Mercati';
}

function estimateImpact(title: string): 'high' | 'medium' | 'low' {
  const text = title.toLowerCase();
  if (text.match(/\b(fed|bce|ecb|crash|crollo|record|guerra|war|sanzioni|sanctions|emergenz|emergency|tass[oi]|iran|surge|plunge|crisis|crisi)\b/)) return 'high';
  if (text.match(/\b(calo|rialzo|trimestral|earning|petrolio|oil|oro|gold|crescita|growth|rally|drop|rise|fall|decline)\b/)) return 'medium';
  return 'low';
}

async function fetchFromNewsAPI(): Promise<NewsItem[]> {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];
  try {
    // Fetch notizie italiane business + query finanziaria globale in inglese
    const [itRes, enRes] = await Promise.all([
      fetch(
        `https://newsapi.org/v2/top-headlines?country=it&category=business&pageSize=10&apiKey=${key}`,
        { next: { revalidate: 1800 } }
      ),
      fetch(
        `https://newsapi.org/v2/everything?q=(stock market OR oil price OR gold OR bitcoin OR central bank OR geopolitics OR tariffs)&language=en&sortBy=publishedAt&pageSize=10&apiKey=${key}`,
        { next: { revalidate: 1800 } }
      ),
    ]);

    const itData = await itRes.json();
    const enData = await enRes.json();

    const allArticles = [
      ...(itData.status === 'ok' && itData.articles ? itData.articles : []),
      ...(enData.status === 'ok' && enData.articles ? enData.articles : []),
    ];

    return allArticles
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
    // Finnhub: notizie di mercato generali (include finance, forex, crypto, merger)
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${key}`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    // Filtra solo notizie rilevanti a finanza/mercati/geopolitica
    const financeKeywords = /stock|market|oil|gold|silver|bitcoin|crypto|fed|ecb|rate|inflation|gdp|trade|tariff|war|iran|china|bank|earnings|revenue|nasdaq|s&p|dow|commodit/i;
    const filtered = data.filter((a: { headline: string; summary: string }) =>
      financeKeywords.test(a.headline) || financeKeywords.test(a.summary || '')
    );
    return filtered.slice(0, 10).map((a: { headline: string; summary: string; source: string; url: string; datetime: number; image?: string }, i: number) => ({
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
  // Usa i dati editoriali curati — le API news gratuite non funzionano in produzione
  const response: ApiResponse<NewsItem[]> = {
    data: mockNews,
    isDemo: true,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
