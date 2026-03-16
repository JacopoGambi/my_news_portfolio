'use client';
import { Clock, ExternalLink } from 'lucide-react';
import type { NewsItem } from '@/lib/types';

const impactConfig = {
  high: { emoji: '\uD83D\uDD34', label: 'Alto', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
  medium: { emoji: '\uD83D\uDFE1', label: 'Medio', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  low: { emoji: '\uD83D\uDFE2', label: 'Basso', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
};

const categoryColors: Record<string, string> = {
  'Mercati': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Geopolitica': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Banche Centrali': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Earnings': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Macro': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
};

export default function NewsCard({ news, featured = false }: { news: NewsItem; featured?: boolean }) {
  const impact = impactConfig[news.impact];
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m fa`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h fa`;
    return `${Math.floor(hours / 24)}g fa`;
  };

  return (
    <article
      className={`group bg-card-bg rounded-xl border border-border-color p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 ${
        featured ? 'md:col-span-2 border-l-2 border-l-accent' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${categoryColors[news.category] || 'bg-gray-500/15 text-gray-400'}`}>
          {news.category}
        </span>
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${impact.className}`}>
          {impact.emoji} {impact.label}
        </span>
      </div>

      <h3 className={`font-bold text-foreground mb-2 leading-snug group-hover:text-accent transition-colors ${featured ? 'text-lg' : 'text-sm'}`}>
        {news.title}
      </h3>

      <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
        {news.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground/70">Fonte: {news.source}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {timeAgo(news.publishedAt)}
          </span>
        </div>
        {news.url && news.url !== '#' && (
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent hover:underline"
          >
            Leggi <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}
