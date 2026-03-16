export default function Footer() {
  return (
    <footer className="border-t border-border-color bg-card-bg mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Disclaimer</h3>
            <p className="text-xs text-muted leading-relaxed">
              Le informazioni fornite da MyNews sono a scopo esclusivamente informativo e non costituiscono consulenza finanziaria,
              raccomandazione di investimento o sollecitazione all&apos;acquisto o vendita di strumenti finanziari.
              Ogni decisione di investimento deve essere presa in autonomia e sotto la propria responsabilit&agrave;.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Fonti Dati</h3>
            <ul className="text-xs text-muted space-y-1.5">
              <li>Yahoo Finance (dati di mercato in tempo reale)</li>
              <li>CoinGecko (criptovalute)</li>
              <li>Notizie curate da fonti italiane e internazionali</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">MyNews</h3>
            <p className="text-xs text-muted leading-relaxed mb-2">
              Aggregatore di notizie finanziarie e geopolitiche per decisioni di portafoglio informate.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border-color text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} MyNews by Jacopo Gambi — Decisioni informate, ogni giorno
          </p>
        </div>
      </div>
    </footer>
  );
}
