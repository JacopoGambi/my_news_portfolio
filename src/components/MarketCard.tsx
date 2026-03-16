'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import type { MarketItem } from '@/lib/types';
import MarketChartModal from './MarketChartModal';

const categoryLabels: Record<MarketItem['category'], string> = {
  index: 'Indice',
  commodity: 'Materia Prima',
  crypto: 'Crypto',
  currency: 'Valuta',
};

export default function MarketCard({ item }: { item: MarketItem }) {
  const [showChart, setShowChart] = useState(false);
  const isPositive = item.changePercent > 0;
  const isNeutral = item.changePercent === 0;
  const colorClass = isNeutral ? 'text-muted' : isPositive ? 'text-positive' : 'text-negative';
  const bgTint = isNeutral
    ? 'border-border-color'
    : isPositive
      ? 'border-positive/10 hover:border-positive/25'
      : 'border-negative/10 hover:border-negative/25';

  const formatPrice = (price: number) => {
    if (item.category === 'currency') return price.toFixed(4);
    const formatted = price >= 10000
      ? price.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : price.toFixed(2);
    return `€${formatted}`;
  };

  return (
    <>
      <div
        onClick={() => setShowChart(true)}
        className={`bg-card-bg rounded-xl border ${bgTint} p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 cursor-pointer`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
            {categoryLabels[item.category]}
          </span>
          <span className="text-[10px] text-muted font-mono">{item.symbol}</span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-2 truncate">{item.name}</p>
        <p className="text-lg font-bold text-foreground font-mono">{formatPrice(item.price)}</p>
        <div className={`flex items-center gap-1 mt-1 ${colorClass}`}>
          {isNeutral ? <Minus size={14} /> : isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span className="text-sm font-semibold font-mono">
            {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
          </span>
          <span className="text-xs text-muted ml-1">
            ({isPositive ? '+' : ''}{item.change.toFixed(2)})
          </span>
        </div>
      </div>

      {showChart && (
        <MarketChartModal item={item} onClose={() => setShowChart(false)} />
      )}
    </>
  );
}
