'use client';
import { useState, useEffect, useCallback } from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { MarketItem } from '@/lib/types';

type Period = '1D' | '1W' | '1M' | '3M' | '1Y';

interface HistoryPoint {
  date: string;
  price: number;
}

interface MarketChartModalProps {
  item: MarketItem;
  onClose: () => void;
}

const periodLabels: Record<Period, string> = {
  '1D': '1G', '1W': '1S', '1M': '1M', '3M': '3M', '1Y': '1A',
};

const categoryLabels: Record<MarketItem['category'], string> = {
  index: 'Indice', commodity: 'Materia Prima', crypto: 'Crypto', currency: 'Valuta',
};

function formatDateLabel(iso: string, period: Period): string {
  const d = new Date(iso);
  if (period === '1D') return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  if (period === '1W') return d.toLocaleDateString('it-IT', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  if (period === '1M' || period === '3M') return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  return d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
}

function formatPrice(price: number, category: MarketItem['category']): string {
  if (category === 'currency') return price.toFixed(4);
  if (price >= 10000) return price.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(2);
}

export default function MarketChartModal({ item, onClose }: MarketChartModalProps) {
  const [period, setPeriod] = useState<Period>('1D');
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market/history?symbol=${encodeURIComponent(item.symbol)}&period=${p}`);
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setData([]);
    }
    setLoading(false);
  }, [item.symbol]);

  useEffect(() => {
    fetchHistory(period);
  }, [period, fetchHistory]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Calcola variazione dal primo all'ultimo punto del periodo
  const firstPrice = data.length > 0 ? data[0].price : item.price;
  const lastPrice = data.length > 0 ? data[data.length - 1].price : item.price;
  const periodChange = lastPrice - firstPrice;
  const periodChangePercent = firstPrice !== 0 ? (periodChange / firstPrice) * 100 : 0;

  const isPositive = periodChangePercent > 0;
  const isNeutral = periodChangePercent === 0;
  const colorClass = isNeutral ? 'text-muted' : isPositive ? 'text-positive' : 'text-negative';
  const chartColor = isNeutral ? '#8b949e' : isPositive ? 'var(--color-positive)' : 'var(--color-negative)';

  const minPrice = data.length > 0 ? Math.min(...data.map(d => d.price)) : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map(d => d.price)) : 0;
  const padding = (maxPrice - minPrice) * 0.1 || maxPrice * 0.01;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-card-bg border border-border-color rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
                {categoryLabels[item.category]}
              </span>
              <span className="text-[10px] text-muted font-mono">{item.symbol}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold text-foreground font-mono">
                {formatPrice(item.price, item.category)}
              </span>
              <div className={`flex items-center gap-1 ${colorClass}`}>
                {isNeutral ? <Minus size={16} /> : isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="text-sm font-semibold font-mono">
                  {isPositive ? '+' : ''}{periodChangePercent.toFixed(2)}%
                </span>
                <span className="text-xs text-muted">
                  ({isPositive ? '+' : ''}{periodChange.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-border-color/30 transition-colors text-muted hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Period tabs */}
        <div className="flex gap-1 px-5 mb-4">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                period === p
                  ? 'bg-accent text-white'
                  : 'bg-border-color/20 text-muted hover:text-foreground hover:bg-border-color/40'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="px-5 pb-5">
          <div className="h-64 sm:h-72">
            {loading ? (
              <div className="w-full h-full bg-skeleton/30 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`gradient-${item.symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => formatDateLabel(v, period)}
                    tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[minPrice - padding, maxPrice + padding]}
                    tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => item.category === 'currency' ? v.toFixed(3) : v.toLocaleString()}
                    width={65}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0].payload as HistoryPoint;
                      return (
                        <div className="bg-card-bg border border-border-color rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-[11px] text-muted mb-1">
                            {new Date(point.date).toLocaleString('it-IT', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                          <p className="text-sm font-bold text-foreground font-mono">
                            {formatPrice(point.price, item.category)}
                          </p>
                        </div>
                      );
                    }}
                    cursor={{ stroke: 'var(--color-border-color)', strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#gradient-${item.symbol})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
