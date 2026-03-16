'use client';
import { useMarketData } from '@/hooks/useMarketData';
import MarketCard from './MarketCard';
import { SkeletonMarketCard } from './SkeletonCard';
import { BarChart3 } from 'lucide-react';

export default function MarketOverview() {
  const { marketData, isLoading, error } = useMarketData();

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-accent" />
        <h2 className="text-lg font-bold text-foreground">Market Overview</h2>
      </div>
      {error && (
        <div className="bg-negative/10 border border-negative/30 rounded-lg p-3 mb-4 text-sm text-negative">
          Errore nel caricamento dei dati di mercato. Verranno mostrati gli ultimi dati disponibili.
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {isLoading
          ? Array.from({ length: 11 }).map((_, i) => <SkeletonMarketCard key={i} />)
          : marketData.map((item) => <MarketCard key={item.symbol} item={item} />)
        }
      </div>
    </section>
  );
}
