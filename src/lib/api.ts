const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Errore nel caricamento dei dati');
    throw error;
  }
  return res.json();
};

export default fetcher;
