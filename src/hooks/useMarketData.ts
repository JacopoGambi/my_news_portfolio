'use client';
import useSWR from 'swr';
import fetcher from '@/lib/api';
import type { MarketItem, ApiResponse } from '@/lib/types';

export function useMarketData() {
  const { data, error, isLoading } = useSWR<ApiResponse<MarketItem[]>>(
    '/api/market',
    fetcher,
    {
      refreshInterval: 30_000, // 30 secondi
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 10000,
    }
  );

  return {
    marketData: data?.data || [],
    isDemo: data?.isDemo ?? false,
    lastUpdated: data?.lastUpdated || null,
    isLoading,
    error,
  };
}
