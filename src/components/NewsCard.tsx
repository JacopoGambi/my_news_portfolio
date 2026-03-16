'use client';
import { Clock, ExternalLink, TrendingUp, Globe, Landmark, BarChart3, PieChart } from 'lucide-react';
import type { NewsItem, NewsCategory } from '@/lib/types';
import { useState } from 'react';

const impactConfig = {
  high: { label: 'Impatto Alto', className: 'bg-red-500/10 text-red-400 border-red-500/10' },
  medium: { label: 'Impatto Medio', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/10' },
  low: { label: 'Impatto Basso', className: 'bg-green-500/10 text-green-400 border-green-500/10' },
};

const categoryConfig: Record<NewsCategory, { className: string; icon: React.ReactNode }> = {
  'Mercati': { className: 'text-blue-400', icon: <TrendingUp size={14} /> },
  'Geopolitica': { className: 'text-orange-400', icon: <Globe size={14} /> },
  'Banche Centrali': { className: 'text-purple-400', icon: <Landmark size={14} /> },
  'Earnings': { className: 'text-emerald-400', icon: <BarChart3 size={14} /> },
  'Macro': { className: 'text-cyan-400', icon: <PieChart size={14} /> },
};

const impactBar = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export default function NewsCard({ news, isHero = false }: { news: NewsItem; isHero?: boolean }) {
  const impact = impactConfig[news.impact];
  const cat = categoryConfig[news.category] || { className: 'text-gray-400', icon: null };
  const [imgError, setImgError] = useState(false);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min fa`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ore fa`;
    return `${Math.floor(hours / 24)} giorni fa`;
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const showImage = news.imageUrl && !imgError;

  // Hero: prima notizia, layout grande
  if (isHero) {
    return (
      <article className="group relative">
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${impactBar[news.impact]}`} />
        <div className="pl-6">
          {/* Immagine hero */}
          {showImage && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-5">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main-bg/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-black/50 backdrop-blur-sm ${cat.className}`}>
                  {cat.icon} {news.category}
                </span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm bg-black/30 ${impact.className}`}>
                  {impact.label}
                </span>
              </div>
            </div>
          )}

          {/* Meta senza immagine */}
          {!showImage && (
            <div className="flex items-center gap-2 mb-3">
              <span className={`flex items-center gap-1.5 text-xs font-semibold ${cat.className}`}>
                {cat.icon} {news.category}
              </span>
              <span className="text-border-color">|</span>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${impact.className}`}>
                {impact.label}
              </span>
            </div>
          )}

          {/* Titolo */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight mb-4 group-hover:text-accent transition-colors">
            {news.title}
          </h2>

          {/* Descrizione completa */}
          <p className="text-base text-muted leading-7 mb-5 max-w-3xl">
            {news.description}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="font-semibold text-foreground/80">
              {news.source}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {formatDate(news.publishedAt)}
            </span>
            <span className="text-xs bg-card-bg px-2 py-0.5 rounded-full border border-border-color">
              {timeAgo(news.publishedAt)}
            </span>
            {news.url && news.url !== '#' && (
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent hover:underline ml-auto"
              >
                Leggi l&apos;articolo completo <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Standard: notizia con layout orizzontale
  return (
    <article className="group relative">
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full ${impactBar[news.impact]}`} />
      <div className="pl-5 flex flex-col md:flex-row gap-5">
        {/* Contenuto testuale */}
        <div className="flex-1 min-w-0">
          {/* Categoria + impatto */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 text-xs font-semibold ${cat.className}`}>
              {cat.icon} {news.category}
            </span>
            <span className="text-border-color">|</span>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${impact.className}`}>
              {impact.label}
            </span>
          </div>

          {/* Titolo */}
          <h3 className="text-lg font-bold text-foreground leading-snug mb-3 group-hover:text-accent transition-colors">
            {news.title}
          </h3>

          {/* Descrizione */}
          <p className="text-sm text-muted leading-relaxed mb-4">
            {news.description}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="font-semibold text-foreground/70">{news.source}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(news.publishedAt)}
            </span>
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
        </div>

        {/* Immagine laterale */}
        {showImage && (
          <div className="md:w-52 lg:w-64 flex-shrink-0">
            <div className="relative w-full h-36 md:h-full rounded-lg overflow-hidden">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
