'use client';
import { useCalendar } from '@/hooks/useCalendar';
import { SkeletonCalendarRow } from './SkeletonCard';
import { Calendar, AlertCircle } from 'lucide-react';

const impactDot = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const countryFlags: Record<string, string> = {
  US: '\uD83C\uDDFA\uD83C\uDDF8',
  EU: '\uD83C\uDDEA\uD83C\uDDFA',
  DE: '\uD83C\uDDE9\uD83C\uDDEA',
  GB: '\uD83C\uDDEC\uD83C\uDDE7',
  JP: '\uD83C\uDDEF\uD83C\uDDF5',
  CN: '\uD83C\uDDE8\uD83C\uDDF3',
};

export default function EconomicCalendar() {
  const { calendar, isLoading, error } = useCalendar();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-accent" />
        <h2 className="text-lg font-bold text-foreground">Calendario Economico</h2>
      </div>

      {error && (
        <div className="bg-negative/10 border border-negative/30 rounded-lg p-3 mb-4 text-sm text-negative flex items-center gap-2">
          <AlertCircle size={16} />
          Errore nel caricamento del calendario.
        </div>
      )}

      <div className="bg-card-bg rounded-xl border border-border-color overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-card-bg border-b border-border-color text-[11px] font-semibold text-muted uppercase tracking-wider">
          <div className="col-span-2">Data</div>
          <div className="col-span-1">Ora</div>
          <div className="col-span-5">Evento</div>
          <div className="col-span-1 text-center">Impatto</div>
          <div className="col-span-1 text-center">Previsione</div>
          <div className="col-span-1 text-center">Precedente</div>
        </div>

        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCalendarRow key={i} />)
        ) : (
          calendar.map((event) => (
            <div
              key={event.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 border-b border-border-color last:border-b-0 hover:bg-accent/5 transition-colors"
            >
              <div className="sm:col-span-2 text-sm font-medium text-foreground">
                {formatDate(event.date)}
              </div>
              <div className="sm:col-span-1 text-sm text-muted font-mono">
                {event.time}
              </div>
              <div className="sm:col-span-5 text-sm text-foreground flex items-center gap-2">
                <span>{countryFlags[event.country] || ''}</span>
                <span>{event.event}</span>
              </div>
              <div className="sm:col-span-1 flex justify-center items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${impactDot[event.impact]}`} />
              </div>
              <div className="sm:col-span-1 text-sm text-center text-muted font-mono">
                {event.forecast || '-'}
              </div>
              <div className="sm:col-span-1 text-sm text-center text-muted font-mono">
                {event.previous || '-'}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
