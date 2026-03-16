import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export interface HistoryPoint {
  date: string;
  price: number;
}

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';

// Mappa simbolo interno → simbolo Yahoo Finance
const YAHOO_SYMBOLS: Record<string, string> = {
  SPX: '^GSPC', IXIC: '^IXIC', FTSEMIB: 'FTSEMIB.MI', GDAXI: '^GDAXI',
  N225: '^N225', 'GC=F': 'GC=F', 'CL=F': 'CL=F', 'SI=F': 'SI=F',
  BTC: 'BTC-USD', ETH: 'ETH-USD', EURUSD: 'EURUSD=X', EURGBP: 'EURGBP=X',
};

const INTERVAL_MAP: Record<Period, '5m' | '30m' | '1d' | '1wk'> = {
  '1D': '5m',
  '1W': '30m',
  '1M': '1d',
  '3M': '1d',
  '1Y': '1wk',
};

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get('symbol');
  const period = (searchParams.get('period') || '1D') as Period;

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
  }

  const validPeriods: Period[] = ['1D', '1W', '1M', '3M', '1Y'];
  if (!validPeriods.includes(period)) {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
  }

  const yahooSymbol = YAHOO_SYMBOLS[symbol] || symbol;
  const interval = INTERVAL_MAP[period];
  const period1 = getStartDate(period);

  try {
    const result = await yahooFinance.chart(yahooSymbol, {
      period1,
      interval,
    });

    const history: HistoryPoint[] = (result.quotes || [])
      .filter((q: { close?: number | null; date?: Date | null }) => q.close != null && q.date != null)
      .map((q: { close?: number | null; date?: Date | null }) => ({
        date: q.date!.toISOString(),
        price: Math.round(q.close! * 100) / 100,
      }));

    return NextResponse.json({ symbol, period, data: history });
  } catch (error) {
    console.error(`Yahoo Finance chart error for ${yahooSymbol}:`, error);
    return NextResponse.json({ symbol, period, data: [] });
  }
}

function getStartDate(period: Period): Date {
  const now = new Date();
  switch (period) {
    case '1D': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '1W': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1M': return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case '3M': return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    case '1Y': return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }
}
