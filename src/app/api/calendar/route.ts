import { NextResponse } from 'next/server';
import { mockCalendar } from '@/lib/mockData';
import type { CalendarEvent, ApiResponse } from '@/lib/types';

async function fetchFinnhubCalendar(): Promise<CalendarEvent[]> {
  const key = process.env.FINNHUB_KEY;
  if (!key) return [];
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?from=${today}&to=${nextWeek}&token=${key}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (!data.economicCalendar?.length) return [];
    return data.economicCalendar
      .filter((e: { impact: string }) => e.impact === 'high' || e.impact === 'medium')
      .slice(0, 10)
      .map((e: { event: string; country: string; time: string; impact: string; estimate: string; prev: string }, i: number) => ({
        id: `finnhub-cal-${i}`,
        date: today,
        time: e.time || 'TBD',
        event: e.event,
        country: e.country,
        impact: e.impact === 'high' ? 'high' : e.impact === 'medium' ? 'medium' : 'low',
        forecast: e.estimate,
        previous: e.prev,
      }));
  } catch {
    return [];
  }
}

export async function GET() {
  let isDemo = true;
  let calendar: CalendarEvent[] = [];

  const finnhubData = await fetchFinnhubCalendar();
  if (finnhubData.length > 0) {
    isDemo = false;
    calendar = finnhubData;
  } else {
    calendar = mockCalendar;
  }

  const response: ApiResponse<CalendarEvent[]> = {
    data: calendar,
    isDemo,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
