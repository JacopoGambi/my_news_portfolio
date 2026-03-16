import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My News',
  description: 'Aggregatore di notizie finanziarie e geopolitiche per decisioni di portafoglio informate. Dati di mercato in tempo reale, notizie da fonti attendibili, calendario economico.',
  keywords: ['finanza', 'mercati', 'notizie', 'trading', 'investimenti', 'geopolitica', 'economia'],
  openGraph: {
    title: 'My News — Decisioni informate, ogni giorno',
    description: 'Aggregatore di notizie finanziarie e geopolitiche per decisioni di portafoglio.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
