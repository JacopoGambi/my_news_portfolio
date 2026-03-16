import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mockData';
import type { NewsItem, NewsCategory, ApiResponse } from '@/lib/types';

// Cache in-memory
let cachedData: { data: NewsItem[]; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minuti

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

function categorizeNews(title: string, description: string): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();
  const titleLower = title.toLowerCase();
  // Banche Centrali — sempre priorità massima
  if (text.match(/\b(fed |bce|ecb|boj|bank of|tass[oi]|rates?|monetar|interest rate|powell|lagarde|central bank|banca central|politica monetaria)\b/)) return 'Banche Centrali';
  // Earnings
  if (text.match(/\b(earning|trimestral|ricavi|profitt|quarter|eps|revenue|results|utili|bilancio societar|guidance|fatturato)\b/)) return 'Earnings';
  // Mercati — se il TITOLO parla di prezzi/asset, è Mercati anche se menziona geopolitica
  if (titleLower.match(/\b(prezzo|prezzi|barile|dollari al barile|borsa|borse|listini|piazza affari|wall street|nasdaq|s&p|azioni|titoli|rally|crollo|rialzo|calo|spread|rendiment|obbligazion|bond|futures|etf|bitcoin|crypto|oro al|petrolio a|argento)\b/)) return 'Mercati';
  // Geopolitica
  if (text.match(/\b(guerra|war|sanzioni|sanctions|dazi|tariff|geopolit|elezioni|election|nato|conflict|iran|russia|china|cina|trump|missile|militar[ei]|diplomaz|medio oriente|ucraina|palestin|israele|israeli|soldati|raid|teheran|kiev|mosca|pechino|assedio|bombardament|arma|armi|nucleare|pasdaran|hezbollah|hamas|cisgiordania|gaza|striscia|ceceni|esercito|invasione|occupazione|coloni|attacco|attacchi)\b/)) return 'Geopolitica';
  // Macro
  if (text.match(/\b(pil|gdp|inflazione|inflation|cpi|pmi|occupazione|unemployment|jobs|disoccupazione|macro|retail sales|consumer|istat|eurostat|debito pubblico)\b/)) return 'Macro';
  return 'Mercati';
}

function estimateImpact(title: string): 'high' | 'medium' | 'low' {
  const text = title.toLowerCase();
  if (text.match(/\b(fed |bce|ecb|crash|crollo|record|guerra|war|sanzioni|sanctions|emergenz|emergency|tass[oi]|iran|surge|plunge|crisis|crisi|allarme|storico|missile|raid|bomb|uccis[io]|mort[ei]|strage|attacco|invasione|soldati|nuclear)\b/)) return 'high';
  if (text.match(/\b(calo|rialzo|trimestral|earning|petrolio|oil|oro|gold|crescita|growth|rally|drop|rise|fall|decline|aumento|ribasso|tensioni)\b/)) return 'medium';
  return 'low';
}

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// Pulisce la description GNews: rimuove "Scopri di più", "Leggi tutto", etc.
function cleanDescription(text: string): string {
  return text
    .replace(/\s*(Scopri di più|Leggi tutto|Continua a leggere|Read more|\.{3,}\s*$)/gi, '')
    .replace(/\s*\(\w+\)\s*$/, '')
    .trim();
}

// Filtra articoli non rilevanti per finanza/geopolitica
function isRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const irrelevant = /\b(ricetta|cucina|oroscopo|gossip|reality|serie tv|calcio|sport|meteo|moda|bellezza|chirurgia estetica|auto guida)\b/;
  return !irrelevant.test(text);
}

async function fetchFromGNews(): Promise<NewsItem[]> {
  const key = process.env.GNEWS_KEY;
  if (!key) return [];

  try {
    // 1) Search finanziaria per notizie mercati/economia
    // 2) World headlines per geopolitica
    const [financeRes, worldRes] = await Promise.all([
      fetch(
        `https://gnews.io/api/v4/search?q=borsa OR mercati OR economia OR banche OR petrolio OR oro OR bitcoin OR inflazione&lang=it&max=10&sortby=publishedAt&apikey=${key}`,
        { signal: AbortSignal.timeout(8000) }
      ),
      fetch(
        `https://gnews.io/api/v4/top-headlines?category=world&lang=it&max=5&apikey=${key}`,
        { signal: AbortSignal.timeout(8000) }
      ),
    ]);

    if (!financeRes.ok || !worldRes.ok) {
      console.error('GNews API error:', { financeStatus: financeRes.status, worldStatus: worldRes.status });
      return [];
    }

    const financeData: GNewsResponse = await financeRes.json();
    const worldData: GNewsResponse = await worldRes.json();

    const allArticles = [
      ...(financeData.articles || []),
      ...(worldData.articles || []),
    ];

    // Deduplica per titolo
    const seen = new Set<string>();
    const unique = allArticles.filter(a => {
      const normalizedTitle = a.title.toLowerCase().trim().slice(0, 60);
      if (seen.has(normalizedTitle)) return false;
      seen.add(normalizedTitle);
      return true;
    });

    return unique
      .filter(a => a.title && a.title.length > 10)
      .filter(a => isRelevant(a.title, a.description || ''))
      .map((a, i) => ({
        id: `gnews-${i}`,
        title: a.title,
        description: cleanDescription(a.description || ''),
        source: a.source?.name || 'GNews',
        url: a.url || '#',
        publishedAt: a.publishedAt,
        category: categorizeNews(a.title, a.description || ''),
        impact: estimateImpact(a.title),
        imageUrl: a.image || undefined,
      }));
  } catch (error) {
    console.error('GNews fetch error:', error);
    return [];
  }
}

export async function GET() {
  // Restituisci dati cached se ancora validi
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    const response: ApiResponse<NewsItem[]> = {
      data: cachedData.data,
      isDemo: false,
      lastUpdated: new Date(cachedData.timestamp).toISOString(),
    };
    return NextResponse.json(response);
  }

  // Prova GNews
  const liveNews = await fetchFromGNews();

  if (liveNews.length > 0) {
    cachedData = { data: liveNews, timestamp: Date.now() };

    const response: ApiResponse<NewsItem[]> = {
      data: liveNews,
      isDemo: false,
      lastUpdated: new Date().toISOString(),
    };
    return NextResponse.json(response);
  }

  // Fallback: dati cached scaduti o mock
  if (cachedData) {
    const response: ApiResponse<NewsItem[]> = {
      data: cachedData.data,
      isDemo: false,
      lastUpdated: new Date(cachedData.timestamp).toISOString(),
    };
    return NextResponse.json(response);
  }

  const response: ApiResponse<NewsItem[]> = {
    data: mockNews,
    isDemo: true,
    lastUpdated: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
