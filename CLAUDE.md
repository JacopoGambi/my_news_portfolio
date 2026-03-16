# MyNews — Regole Operative

## Regola 0: Contesto Iniziale (PRIORITA MASSIMA)

All'inizio di ogni nuova conversazione, PRIMA di svolgere qualsiasi task:

1. Leggere TUTTI i file `.md` presenti nella cartella `backup/`
2. Usare il contenuto per ricostruire il contesto di cio che e stato fatto nelle sessioni precedenti
3. Solo dopo aver letto e compreso il contesto, procedere con la nuova richiesta

Questa regola e automatica e non richiede istruzioni da parte dell'utente.

## Regola 1: Backup Post-Task

Dopo ogni task completato, creare un file `.md` nella cartella `backup/` con il contesto della task.
Il file deve chiamarsi con: `titolo-inerente_HH-MM_DD-MM-YY.md`

## Regola 2: Context7

Prima di usare qualsiasi libreria o framework, consultare Context7 per la documentazione aggiornata.
Questo include setup, code generation, API references e utilizzo di pacchetti specifici.

## Stack Tecnologico

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS 4
- **Icone**: Lucide React
- **Data Fetching**: SWR
- **Tema**: next-themes
- **Linguaggio**: TypeScript

## Struttura Cartelle

```
MyNews/
├── CLAUDE.md
├── README.md
├── .env.example
├── backup/
├── src/
│   ├── app/          # Next.js App Router pages e API routes
│   ├── components/   # Componenti React riutilizzabili
│   ├── lib/          # Utility, tipi, mock data, API helpers
│   └── hooks/        # Custom hooks per data fetching
```
