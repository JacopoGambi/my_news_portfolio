# MyNews — Regole Operative

## Regola 1: Documento di Progetto Obbligatorio

Ogni volta che viene richiesta una nuova funzionalità, modifica o cambiamento:

1. **Verificare data e ora corrente** con il comando di sistema appropriato
2. **Creare un documento** in `docs/progetto/` con formato nome: `HH:MM-DD-MM-YY.md`
3. Il documento deve contenere:
   - **Titolo**: descrizione sintetica della feature/modifica
   - **Obiettivo**: cosa si vuole ottenere
   - **Modifiche previste**: lista dei file che verranno creati/modificati
   - **Approccio tecnico**: come verrà implementata la modifica
   - **Impatto**: eventuali effetti collaterali o dipendenze
4. **Solo dopo aver creato il documento**, procedere con l'implementazione

## Regola 2: Backup Post-Task

Dopo ogni task completato, creare un file `.md` nella cartella `backup/` con il contesto della task.
Il file deve chiamarsi con: `titolo-inerente_HH-MM_DD-MM-YY.md`

## Regola 3: Context7

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
├── docs/progetto/
├── backup/
├── src/
│   ├── app/          # Next.js App Router pages e API routes
│   ├── components/   # Componenti React riutilizzabili
│   ├── lib/          # Utility, tipi, mock data, API helpers
│   └── hooks/        # Custom hooks per data fetching
```
