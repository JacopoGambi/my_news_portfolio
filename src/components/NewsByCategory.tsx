'use client';
import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import NewsCard from './NewsCard';
import { SkeletonNewsCard } from './SkeletonCard';
import { Filter } from 'lucide-react';
import type { NewsCategory } from '@/lib/types';

const tabs: Array<{ label: string; value: NewsCategory | 'all' }> = [
  { label: 'Tutti', value: 'all' },
  { label: 'Mercati', value: 'Mercati' },
  { label: 'Geopolitica', value: 'Geopolitica' },
  { label: 'Banche Centrali', value: 'Banche Centrali' },
  { label: 'Earnings', value: 'Earnings' },
  { label: 'Macro', value: 'Macro' },
];

export default function NewsByCategory() {
  const [activeTab, setActiveTab] = useState<NewsCategory | 'all'>('all');
  const { news, isLoading } = useNews();

  const filtered = activeTab === 'all'
    ? news
    : news.filter(n => n.category === activeTab);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-accent" />
        <h2 className="text-lg font-bold text-foreground">Notizie per Categoria</h2>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.value
                ? 'bg-accent text-white shadow-md shadow-accent/25'
                : 'bg-card-bg border border-border-color text-muted hover:text-foreground hover:border-accent/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonNewsCard key={i} />)
          : filtered.length > 0
            ? filtered.map((item) => <NewsCard key={item.id} news={item} />)
            : (
              <div className="col-span-full text-center py-12 text-muted">
                Nessuna notizia in questa categoria al momento.
              </div>
            )
        }
      </div>
    </section>
  );
}
