import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { mockMarketData } from '@/lib/mockData';
import type { MarketItem, ApiResponse } from '@/lib/types';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Mappa dei simboli Yahoo Finance → simbolo interno + metadata
const SYMBOLS: Array<{
  yahoo: string;
  symbol: string;
  name: string;
  category: MarketItem['category'];
}> = [
  // Indici
  { yahoo: '^GSPC', symbol: 'SPX', name: 'S&P 500', category: 'index' },
  { yahoo: '^IXIC', symbol: 'IXIC', name: 'NASDAQ', category: 'index' },
  { yahoo: 'FTSEMIB.MI', symbol: 'FTSEMIB', name: 'FTSE MIB', category: 'index' },
  { yahoo: '^GDAXI', symbol: 'GDAXI', name: 'DAX', category: 'index' },
  { yahoo: '^N225', symbol: 'N225', name: 'Nikkei 225', category: 'index' },
  // Materie prime
  { yahoo: 'GC=F', symbol: 'GC=F', name: 'Oro', category: 'commodity' },
  { yahoo: 'CL=F', symbol: 'CL=F', name: 'Petrolio WTI', category: 'commodity' },
  { yahoo: 'SI=F', symbol: 'SI=F', name: 'Argento', category: 'commodity' },
  // Crypto
  { yahoo: 'BTC-USD', symbol: 'BTC', name: 'Bitcoin', category: 'crypto' },
  { yahoo: 'ETH-USD', symbol: 'ETH', name: 'Ethereum', category: 'crypto' },
  // Valute
  { yahoo: 'EURUSD=X', symbol: 'EURUSD', name: 'EUR/USD', category: 'currency' },
  { yahoo: 'EURGBP=X', symbol: 'EURGBP', name: 'EUR/GBP', category: 'currency' },
];

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const yahooSymbols = SYMBOLS.map(s => s.yahoo);
    const quotes = await yahooFinance.quote(yahooSymbols);

    // Normalizza: quote() può restituire un singolo oggetto o un array
    const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

    const quoteMap = new Map<string, (typeof quotesArray)[number]>();
    for (const q of quotesArray) {
      if (q && q.symbol) quoteMap.set(q.symbol, q);
    }

    const marketData: MarketItem[] = SYMBOLS.map((s) => {
      const q = quoteMap.get(s.yahoo);

      if (q && q.regularMarketPrice != null) {
        return {
          symbol: s.symbol,
          name: s.name,
          price: q.regularMarketPrice,
          change: q.regularMarketChange ?? 0,
          changePercent: q.regularMarketChangePercent ?? 0,
          category: s.category,
        };
      }

      // Fallback al mock se il quote non è disponibile
      const mock = mockMarketData.find(m => m.symbol === s.symbol);
      return mock ?? {
        symbol: s.symbol,
        name: s.name,
        price: 0,
        change: 0,
        changePercent: 0,
        category: s.category,
      };
    });

    const liveCount = SYMBOLS.filter(s => {
      const q = quoteMap.get(s.yahoo);
      return q && q.regularMarketPrice != null;
    }).length;

    const response: ApiResponse<MarketItem[]> = {
      data: marketData,
      isDemo: liveCount === 0,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Yahoo Finance fetch error:', error);

    // Fallback completo ai dati mock
    const response: ApiResponse<MarketItem[]> = {
      data: [...mockMarketData],
      isDemo: true,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  }
}
