'use client';
import useSWR from 'swr';
import fetcher from '@/lib/api';
import type { MarketItem, ApiResponse } from '@/lib/types';

export function useMarketData() {
  const { data, error, isLoading } = useSWR<ApiResponse<MarketItem[]>>(
    '/api/market',
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000, // 5 minuti
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 10000,
    }
  );

  return {
    marketData: data?.data || [],
    isDemo: data?.isDemo ?? true,
    lastUpdated: data?.lastUpdated || null,
    isLoading,
    error,
  };
}
