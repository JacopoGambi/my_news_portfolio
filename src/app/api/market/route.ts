import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { mockMarketData } from '@/lib/mockData';
import type { MarketItem, ApiResponse } from '@/lib/types';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Cache in-memory per ridurre chiamate e evitare rate limiting
let cachedData: { data: MarketItem[]; timestamp: number } | null = null;
const CACHE_TTL = 45_000; // 45 secondi

// Simboli Yahoo Finance (indici, materie prime, valute) — quotati in USD o valuta locale
const YAHOO_SYMBOLS: Array<{
  yahoo: string;
  symbol: string;
  name: string;
  category: MarketItem['category'];
  needsConversion: boolean; // true = prezzo in USD, convertire in EUR
}> = [
  // Indici — quotati nella propria valuta
  { yahoo: '^GSPC', symbol: 'SPX', name: 'S&P 500', category: 'index', needsConversion: true },
  { yahoo: '^IXIC', symbol: 'IXIC', name: 'NASDAQ', category: 'index', needsConversion: true },
  { yahoo: 'FTSEMIB.MI', symbol: 'FTSEMIB', name: 'FTSE MIB', category: 'index', needsConversion: false }, // già in EUR
  { yahoo: '^GDAXI', symbol: 'GDAXI', name: 'DAX', category: 'index', needsConversion: false }, // già in EUR
  { yahoo: '^N225', symbol: 'N225', name: 'Nikkei 225', category: 'index', needsConversion: true }, // JPY, convertiamo via USD
  // Materie prime — quotate in USD
  { yahoo: 'GC=F', symbol: 'GC=F', name: 'Oro', category: 'commodity', needsConversion: true },
  { yahoo: 'CL=F', symbol: 'CL=F', name: 'Petrolio WTI', category: 'commodity', needsConversion: true },
  { yahoo: 'SI=F', symbol: 'SI=F', name: 'Argento', category: 'commodity', needsConversion: true },
  // Valute — rapporti, non convertire
  { yahoo: 'EURUSD=X', symbol: 'EURUSD', name: 'EUR/USD', category: 'currency', needsConversion: false },
  { yahoo: 'EURGBP=X', symbol: 'EURGBP', name: 'EUR/GBP', category: 'currency', needsConversion: false },
];

// Crypto — le prendiamo da CoinGecko direttamente in EUR
const CRYPTO_IDS: Array<{ id: string; symbol: string; name: string }> = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
];

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

async function fetchWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs)
    ),
  ]);
}

// Fetch crypto da CoinGecko in EUR
async function fetchCryptoPrices(): Promise<MarketItem[]> {
  const ids = CRYPTO_IDS.map(c => c.id).join(',');
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur&include_24hr_change=true`,
    { signal: AbortSignal.timeout(6000) }
  );
  const data = await res.json();

  const results: MarketItem[] = [];
  for (const c of CRYPTO_IDS) {
    const info = data[c.id];
    if (!info) continue;
    const price = info.eur;
    const changePercent = info.eur_24h_change ?? 0;
    const change = price * (changePercent / 100);
    results.push({
      symbol: c.symbol,
      name: c.name,
      price,
      change,
      changePercent,
      category: 'crypto',
    });
  }
  return results;
}

// Fetch tasso USD/EUR per conversione
async function fetchUsdToEur(): Promise<number> {
  const q = await yahooFinance.quote('EURUSD=X');
  const rate = Array.isArray(q) ? q[0] : q;
  if (rate?.regularMarketPrice) {
    return 1 / rate.regularMarketPrice; // USD→EUR = 1/EURUSD
  }
  return 1 / 1.15; // fallback approssimativo
}

export async function GET() {
  // Restituisci dati cached se ancora validi
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    const response: ApiResponse<MarketItem[]> = {
      data: cachedData.data,
      isDemo: false,
      lastUpdated: new Date(cachedData.timestamp).toISOString(),
    };
    return NextResponse.json(response);
  }

  try {
    // Fetch in parallelo: Yahoo Finance + CoinGecko
    const [yahooResult, cryptoResult] = await Promise.allSettled([
      fetchWithTimeout(async () => {
        const yahooSymbols = YAHOO_SYMBOLS.map(s => s.yahoo);
        const quotes = await yahooFinance.quote(yahooSymbols);
        const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
        const usdToEur = await fetchUsdToEur();

        const quoteMap = new Map<string, (typeof quotesArray)[number]>();
        for (const q of quotesArray) {
          if (q && q.symbol) quoteMap.set(q.symbol, q);
        }

        return YAHOO_SYMBOLS.map((s) => {
          const q = quoteMap.get(s.yahoo);
          if (q && q.regularMarketPrice != null) {
            const conversionRate = s.needsConversion ? usdToEur : 1;
            return {
              symbol: s.symbol,
              name: s.name,
              price: q.regularMarketPrice * conversionRate,
              change: (q.regularMarketChange ?? 0) * conversionRate,
              changePercent: q.regularMarketChangePercent ?? 0,
              category: s.category,
            };
          }
          return null;
        }).filter((x): x is MarketItem => x !== null);
      }, 8000),
      fetchWithTimeout(() => fetchCryptoPrices(), 8000),
    ]);

    const yahooData = yahooResult.status === 'fulfilled' ? yahooResult.value : [];
    const cryptoData = cryptoResult.status === 'fulfilled' ? cryptoResult.value : [];

    // Combina i dati, con fallback ai mock per simboli mancanti
    const allSymbols = [...YAHOO_SYMBOLS.map(s => s.symbol), ...CRYPTO_IDS.map(c => c.symbol)];
    const liveMap = new Map<string, MarketItem>();
    for (const item of [...yahooData, ...cryptoData]) {
      liveMap.set(item.symbol, item);
    }

    const marketData: MarketItem[] = allSymbols.map(symbol => {
      if (liveMap.has(symbol)) return liveMap.get(symbol)!;
      const mock = mockMarketData.find(m => m.symbol === symbol);
      return mock ?? { symbol, name: symbol, price: 0, change: 0, changePercent: 0, category: 'index' };
    });

    const liveCount = liveMap.size;

    if (liveCount > 0) {
      cachedData = { data: marketData, timestamp: Date.now() };
    }

    const response: ApiResponse<MarketItem[]> = {
      data: marketData,
      isDemo: liveCount === 0,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Market fetch error:', error);

    if (cachedData) {
      const response: ApiResponse<MarketItem[]> = {
        data: cachedData.data,
        isDemo: false,
        lastUpdated: new Date(cachedData.timestamp).toISOString(),
      };
      return NextResponse.json(response);
    }

    const response: ApiResponse<MarketItem[]> = {
      data: [...mockMarketData],
      isDemo: true,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  }
}
