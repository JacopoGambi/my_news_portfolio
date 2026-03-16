'use client';
import { useNews } from '@/hooks/useNews';
import NewsCard from './NewsCard';
import { SkeletonNewsCard } from './SkeletonCard';
import { Flame } from 'lucide-react';

export default function TopNews() {
  const { news, isLoading, error } = useNews();
  const topNews = news.slice(0, 6);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={20} className="text-orange-400" />
        <h2 className="text-lg font-bold text-foreground">Top Notizie del Giorno</h2>
      </div>
      {error && (
        <div className="bg-negative/10 border border-negative/30 rounded-lg p-3 mb-4 text-sm text-negative">
          Errore nel caricamento delle notizie. Verranno mostrate le ultime disponibili.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonNewsCard key={i} />)
          : topNews.map((item, i) => (
              <NewsCard key={item.id} news={item} featured={i === 0} />
            ))
        }
      </div>
    </section>
  );
}
