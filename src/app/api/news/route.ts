import { NextResponse } from 'next/server';
import { mockNews } from '@/lib/mockData';
import type { NewsItem, NewsCategory, ApiResponse } from '@/lib/types';

let cachedData: { data: NewsItem[]; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minuti

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

function categorizeNews(title: string, description: string): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();
  const titleLower = title.toLowerCase();
  if (text.match(/\b(fed |bce|ecb|boj|bank of|tass[oi]|rates?|monetar|interest rate|powell|lagarde|central bank|banca central|politica monetaria)\b/)) return 'Banche Centrali';
  if (text.match(/\b(earning|trimestral|ricavi|profitt|quarter|eps|revenue|results|utili|bilancio societar|guidance|fatturato)\b/)) return 'Earnings';
  if (titleLower.match(/\b(prezzo|prezzi|barile|dollari al barile|borsa|borse|listini|piazza affari|wall street|nasdaq|s&p|azioni|titoli|rally|crollo|rialzo|calo|spread|rendiment|obbligazion|bond|futures|etf|bitcoin|crypto|oro al|petrolio a|argento)\b/)) return 'Mercati';
  if (text.match(/\b(guerra|war|sanzioni|sanctions|dazi|tariff|geopolit|elezioni|election|nato|conflict|iran|russia|china|cina|trump|missile|militar[ei]|diplomaz|medio oriente|ucraina|palestin|israele|israeli|soldati|raid|teheran|kiev|mosca|pechino|assedio|bombardament|arma|armi|nucleare|pasdaran|hezbollah|hamas|cisgiordania|gaza|striscia|ceceni|esercito|invasione|occupazione|coloni|attacco|attacchi)\b/)) return 'Geopolitica';
  if (text.match(/\b(pil|gdp|inflazione|inflation|cpi|pmi|occupazione|unemployment|jobs|disoccupazione|macro|retail sales|consumer|istat|eurostat|debito pubblico)\b/)) return 'Macro';
  return 'Mercati';
}

function estimateImpact(title: string): 'high' | 'medium' | 'low' {
  const text = title.toLowerCase();
  if (text.match(/\b(fed |bce|ecb|crash|crollo|record|guerra|war|sanzioni|sanctions|emergenz|emergency|tass[oi]|iran|surge|plunge|crisis|crisi|allarme|storico|missile|raid|bomb|uccis[io]|mort[ei]|strage|attacco|invasione|soldati|nuclear)\b/)) return 'high';
  if (text.match(/\b(calo|rialzo|trimestral|earning|petrolio|oil|oro|gold|crescita|growth|rally|drop|rise|fall|decline|aumento|ribasso|tensioni)\b/)) return 'medium';
  return 'low';
}

const JUNK = /pubblicità personalizzata|cookie|consenso|quotidiano di .+ e provincia|notizie di cronaca, politica, economia, sport|per raccontarti ogni giorno|visualizzato su un altro dispositivo|potrai continuare a leggere|accedi con il tuo account|iscriviti alla newsletter|registrati per continuare|abbonati per leggere/i;

function cleanText(text: string): string {
  return text
    .replace(/\s*\[\d+ chars\]\s*$/, '')
    .replace(/\.{3,}\s*$/, '')
    .replace(/\s*(Scopri di più|Leggi tutto|Continua a leggere|Read more)\.?\s*$/gi, '')
    .replace(/\s*\[\u2026\]\s*$/, '')
    .trim();
}

function isRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const irrelevant = /\b(ricetta|cucina|oroscopo|gossip|reality|serie tv|calcio|sport|meteo|moda|bellezza|chirurgia estetica|auto guida|oscar|academy award|film|cinema|attore|attrice|attori|attrici|regist[ai]|regia|red carpet|hollywood|box office|nomination|premiazione|premio oscar|golden globe|cannes|venezia mostra|festival del cinema|celebrity|celebrit[àa]|spettacolo|intrattenimento|entertainment|show business|concert[oi]|musica|cantante|album|singolo|tour|rapper|pop star|talent show|serie [abc]|champions league|europa league|coppa italia|conference league|campionato|partita|partite|gol |classifica|scudetto|calciomercato|trasferiment|rigore|rigori|arbitr[oi]|pareggi[oa]|allenatore|allenatori|panchina|formazione|tabellino|giornata di|retrocession|promozione in|playoff|playout|derby|fuorigioco|ammonizione|espulsion|cartellino|corner|punizione|dribbling|centrocampist|attaccante|difensore|portiere|titolare|convocati|convocazione|stadio|tifos[io]|curva |ultras|coreografia|formula ?1|motogp|moto ?gp|gran premio|pole position|pit stop|podio|tennis|wimbledon|roland garros|australian open|us open|nba|rugby|pallavolo|pallacanest|nuoto|atletica|olimpiad[ei]|europei di|mondiali di|coppa del mondo|juventus|juve |inter |milan |napoli |roma |lazio |fiorentina|atalanta|torino fc|bologna fc|genoa|sampdoria|lecce |udinese|sassuolo|empoli|cagliari|verona |monza |parma |como calcio|venezia fc)\b/;
  return !irrelevant.test(text);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#160;/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#\d+;/gi, ' ');
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

const RSS_FEEDS = [
  { url: 'https://www.ansa.it/sito/notizie/economia/economia_rss.xml', source: 'ANSA' },
  { url: 'https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml', source: 'ANSA' },
  { url: 'https://www.corriere.it/rss/economia.xml', source: 'Corriere della Sera' },
  { url: 'https://www.ilsole24ore.com/rss/notizie--ultime-notizie.xml', source: 'Il Sole 24 Ore' },
];

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

function parseRSSItems(xml: string, source: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const extractTag = (tag: string): string => {
      const match = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, 'i'));
      return match?.[1]?.trim() ?? '';
    };
    const title = decodeEntities(extractTag('title'));
    const description = decodeEntities(stripHtml(extractTag('description')));
    const linkMatch = block.match(/<link>([^<]+)<\/link>/) || block.match(/<guid[^>]*>([^<]+)<\/guid>/);
    const link = linkMatch?.[1]?.trim() ?? '';
    const pubDate = extractTag('pubDate');
    if (title.length > 5) items.push({ title, description, link, pubDate, source });
  }
  return items;
}

async function fetchFromRSS(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(({ url, source }) =>
      fetch(url, { signal: AbortSignal.timeout(8000) })
        .then(r => r.text())
        .then(xml => parseRSSItems(xml, source))
    )
  );

  const allItems: RSSItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') allItems.push(...result.value);
    else console.error('RSS fetch error:', result.reason);
  }

  if (allItems.length === 0) return [];

  // Ordina per data, più recenti prima
  allItems.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });

  // Deduplica per titolo
  const seen = new Set<string>();
  const unique = allItems.filter(a => {
    const key = a.title.toLowerCase().trim().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique
    .filter(a => isRelevant(a.title, a.description))
    .slice(0, 20)
    .map((a, i) => ({
      id: `rss-${Date.now()}-${i}`,
      title: a.title,
      description: cleanText(a.description),
      source: a.source,
      url: a.link || '#',
      publishedAt: a.pubDate ? new Date(a.pubDate).toISOString() : new Date().toISOString(),
      category: categorizeNews(a.title, a.description),
      impact: estimateImpact(a.title),
    }));
}

export async function GET() {
  const headers = { 'Cache-Control': 'no-store, max-age=0' };

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    const response: ApiResponse<NewsItem[]> = {
      data: cachedData.data,
      isDemo: false,
      lastUpdated: new Date(cachedData.timestamp).toISOString(),
    };
    return NextResponse.json(response, { headers });
  }

  const liveNews = await fetchFromRSS();

  if (liveNews.length > 0) {
    cachedData = { data: liveNews, timestamp: Date.now() };
    const response: ApiResponse<NewsItem[]> = {
      data: liveNews,
      isDemo: false,
      lastUpdated: new Date().toISOString(),
    };
    return NextResponse.json(response, { headers });
  }

  if (cachedData) {
    const response: ApiResponse<NewsItem[]> = {
      data: cachedData.data,
      isDemo: false,
      lastUpdated: new Date(cachedData.timestamp).toISOString(),
    };
    return NextResponse.json(response, { headers });
  }

  const response: ApiResponse<NewsItem[]> = {
    data: mockNews,
    isDemo: true,
    lastUpdated: new Date().toISOString(),
  };
  return NextResponse.json(response, { headers });
}
