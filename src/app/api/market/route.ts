import { NextResponse } from 'next/server';
import { mockMarketData } from '@/lib/mockData';
import type { MarketItem, ApiResponse } from '@/lib/types';

async function fetchAlphaVantage(symbol: string): Promise<Partial<MarketItem> | null> {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) return null;
    return {
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
    };
  } catch {
    return null;
  }
}

async function fetchCryptoData(): Promise<Map<string, Partial<MarketItem>>> {
  const map = new Map<string, Partial<MarketItem>>();
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    if (data.bitcoin) {
      map.set('BTC', {
        price: data.bitcoin.usd,
        changePercent: data.bitcoin.usd_24h_change || 0,
        change: data.bitcoin.usd * (data.bitcoin.usd_24h_change || 0) / 100,
      });
    }
    if (data.ethereum) {
      map.set('ETH', {
        price: data.ethereum.usd,
        changePercent: data.ethereum.usd_24h_change || 0,
        change: data.ethereum.usd * (data.ethereum.usd_24h_change || 0) / 100,
      });
    }
  } catch { /* fallback to mock */ }
  return map;
}

async function fetchForexData(): Promise<Map<string, Partial<MarketItem>>> {
  const map = new Map<string, Partial<MarketItem>>();
  const key = process.env.EXCHANGERATE_KEY;
  if (!key) return map;
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${key}/latest/EUR`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    if (data.conversion_rates) {
      const usdRate = data.conversion_rates.USD;
      const gbpRate = data.conversion_rates.GBP;
      if (usdRate) map.set('EURUSD', { price: usdRate });
      if (gbpRate) map.set('EURGBP', { price: gbpRate });
    }
  } catch { /* fallback to mock */ }
  return map;
}

export async function GET() {
  let isDemo = true;
  const marketData: MarketItem[] = [...mockMarketData];

  try {
    // Fetch crypto data (no key needed for basic tier)
    const cryptoData = await fetchCryptoData();
    if (cryptoData.size > 0) {
      isDemo = false;
      for (const item of marketData) {
        const crypto = cryptoData.get(item.symbol);
        if (crypto) Object.assign(item, crypto);
      }
    }

    // Fetch forex data
    const forexData = await fetchForexData();
    if (forexData.size > 0) {
      isDemo = false;
      for (const item of marketData) {
        const forex = forexData.get(item.symbol);
        if (forex) Object.assign(item, forex);
      }
    }

    // Fetch index/commodity data from Alpha Vantage
    const avKey = process.env.ALPHA_VANTAGE_KEY;
    if (avKey) {
      const symbols = ['SPY', 'QQQ', 'GC=F', 'CL=F', 'SI=F'];
      const mapping: Record<string, string> = { SPY: 'SPX', QQQ: 'IXIC' };
      for (const sym of symbols) {
        const data = await fetchAlphaVantage(sym);
        if (data) {
          isDemo = false;
          const targetSym = mapping[sym] || sym;
          const item = marketData.find(m => m.symbol === targetSym);
          if (item) Object.assign(item, data);
        }
      }
    }
  } catch {
    // Fallback silenzioso ai dati mock
  }

  const response: ApiResponse<MarketItem[]> = {
    data: marketData,
    isDemo,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
