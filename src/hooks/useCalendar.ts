'use client';
import useSWR from 'swr';
import fetcher from '@/lib/api';
import type { CalendarEvent, ApiResponse } from '@/lib/types';

export function useCalendar() {
  const { data, error, isLoading } = useSWR<ApiResponse<CalendarEvent[]>>(
    '/api/calendar',
    fetcher,
    {
      refreshInterval: 60 * 60 * 1000, // 1 ora
      revalidateOnFocus: true,
      errorRetryCount: 3,
    }
  );

  return {
    calendar: data?.data || [],
    isDemo: data?.isDemo ?? true,
    lastUpdated: data?.lastUpdated || null,
    isLoading,
    error,
  };
}
