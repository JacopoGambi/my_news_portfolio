'use client';
import { useNews } from '@/hooks/useNews';
import NewsCard from './NewsCard';
import { SkeletonNewsCard } from './SkeletonCard';
import { Flame } from 'lucide-react';

export default function TopNews() {
  const { news, isLoading, error } = useNews();
  const heroNews = news[0];
  const restNews = news.slice(1, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Flame size={20} className="text-orange-400" />
        <h2 className="text-lg font-bold text-foreground">Top Notizie del Giorno</h2>
      </div>

      {error && (
        <div className="bg-negative/10 border border-negative/30 rounded-lg p-3 mb-4 text-sm text-negative">
          Errore nel caricamento delle notizie. Verranno mostrate le ultime disponibili.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonNewsCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-0">
          {/* Notizia principale (hero) */}
          {heroNews && (
            <div className="pb-8 mb-8 border-b border-border-color">
              <NewsCard news={heroNews} isHero />
            </div>
          )}

          {/* Altre notizie top */}
          {restNews.map((item, i) => (
            <div
              key={item.id}
              className={`py-7 ${i < restNews.length - 1 ? 'border-b border-border-color/50' : ''}`}
            >
              <NewsCard news={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
