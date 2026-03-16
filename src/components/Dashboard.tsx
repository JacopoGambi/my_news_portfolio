'use client';
import { useMarketData } from '@/hooks/useMarketData';
import { useNews } from '@/hooks/useNews';
import Header from './Header';
import MarketOverview from './MarketOverview';
import TopNews from './TopNews';
import NewsByCategory from './NewsByCategory';
import Footer from './Footer';

export default function Dashboard() {
  const { lastUpdated: marketUpdated, isDemo: marketDemo } = useMarketData();
  const { lastUpdated: newsUpdated, isDemo: newsDemo } = useNews();

  const lastUpdated = marketUpdated || newsUpdated;
  const isDemo = marketDemo && newsDemo;

  return (
    <div className="min-h-screen bg-main-bg">
      <Header lastUpdated={lastUpdated} isDemo={isDemo} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <MarketOverview />
        <TopNews />
        <NewsByCategory />
      </main>
      <Footer />
    </div>
  );
}
