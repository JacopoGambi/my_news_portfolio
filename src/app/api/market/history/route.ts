import { NextRequest, NextResponse } from 'next/server';

export interface HistoryPoint {
  date: string;
  price: number;
}

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';

function generateMockHistory(basePrice: number, period: Period): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const now = new Date();
  let count: number;
  let stepMs: number;

  switch (period) {
    case '1D':
      count = 78; // ~6.5h of trading, 5min intervals
      stepMs = 5 * 60 * 1000;
      break;
    case '1W':
      count = 35; // 5 days, ~7 points/day
      stepMs = 3 * 60 * 60 * 1000;
      break;
    case '1M':
      count = 22;
      stepMs = 24 * 60 * 60 * 1000;
      break;
    case '3M':
      count = 65;
      stepMs = 24 * 60 * 60 * 1000;
      break;
    case '1Y':
      count = 52;
      stepMs = 7 * 24 * 60 * 60 * 1000;
      break;
  }

  const volatility = basePrice * 0.008;
  let price = basePrice * (1 - (Math.random() * 0.05));

  for (let i = count; i >= 0; i--) {
    const date = new Date(now.getTime() - i * stepMs);
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price, basePrice * 0.85);
    points.push({
      date: date.toISOString(),
      price: Math.round(price * 100) / 100,
    });
  }

  // Ensure last point matches current price
  if (points.length > 0) {
    points[points.length - 1].price = basePrice;
  }

  return points;
}

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

  // Base prices for mock generation
  const basePrices: Record<string, number> = {
    SPX: 5667.56, IXIC: 17808.34, FTSEMIB: 38245.12, GDAXI: 22456.89,
    N225: 38912.45, 'GC=F': 2987.40, 'CL=F': 68.42, 'SI=F': 33.85,
    BTC: 84235.67, ETH: 1925.34, EURUSD: 1.0892, EURGBP: 0.8367,
  };

  const basePrice = basePrices[symbol] || 100;
  const history = generateMockHistory(basePrice, period);

  return NextResponse.json({ symbol, period, data: history });
}
