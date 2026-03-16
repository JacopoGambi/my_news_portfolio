'use client';
import { Activity } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string | null;
  isDemo: boolean;
}

export default function Header({ lastUpdated, isDemo }: HeaderProps) {
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 bg-main-bg/80 backdrop-blur-xl border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="text-accent" size={28} />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">MyNews</h1>
              <p className="text-[11px] text-muted -mt-0.5 hidden sm:block">Decisioni informate, ogni giorno</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted capitalize">{today}</p>
            <div className="flex items-center gap-1.5 justify-end">
              {lastUpdated && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted">
                    Aggiornato: {formatTime(lastUpdated)}
                  </span>
                </>
              )}
            </div>
          </div>
          {isDemo && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/15">
              DEMO
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
