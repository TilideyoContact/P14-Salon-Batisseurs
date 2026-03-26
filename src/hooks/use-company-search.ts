import { useState, useEffect } from 'react';

export interface CompanyResult {
  nom_complet: string;
  siege: {
    siret: string;
    libelle_voie?: string;
    code_postal?: string;
    libelle_commune?: string;
  };
}

export function useCompanySearch(query: string) {
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(query)}&per_page=5&departement=971,972,973`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        setError('Service indisponible');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading, error };
}
