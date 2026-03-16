'use client';
import useSWR from 'swr';
import fetcher from '@/lib/api';
import type { NewsItem, ApiResponse } from '@/lib/types';

export function useNews() {
  const { data, error, isLoading } = useSWR<ApiResponse<NewsItem[]>>(
    '/api/news',
    fetcher,
    {
      refreshInterval: 30 * 60 * 1000, // 30 minuti
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 15000,
    }
  );

  return {
    news: data?.data || [],
    isDemo: data?.isDemo ?? true,
    lastUpdated: data?.lastUpdated || null,
    isLoading,
    error,
  };
}
