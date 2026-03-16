export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'index' | 'commodity' | 'crypto' | 'currency';
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  category: NewsCategory;
  impact: 'high' | 'medium' | 'low';
  imageUrl?: string;
}

export type NewsCategory = 'Mercati' | 'Geopolitica' | 'Banche Centrali' | 'Earnings' | 'Macro';

export interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  country: string;
  impact: 'high' | 'medium' | 'low';
  forecast?: string;
  previous?: string;
}

export interface ApiResponse<T> {
  data: T;
  isDemo: boolean;
  lastUpdated: string;
}
