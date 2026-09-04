import React, { createContext, useContext, useMemo, useState } from 'react';

interface ValorContextoFavoritos {
  idsFavoritos: Set<string>;
  ehFavorito: (id: string) => boolean;
  alternarFavorito: (id: string) => void;
}

const ContextoFavoritos = createContext<ValorContextoFavoritos | null>(null);

const FAVORITOS_PADRAO = ['st-1', 'st-2'];

export function ProvedorFavoritos({ children }: { children: React.ReactNode }) {
  const [idsFavoritos, setFavoriteIds] = useState<Set<string>>(new Set(FAVORITOS_PADRAO));

  const value = useMemo(
    () => ({
      idsFavoritos,
      ehFavorito: (id: string) => idsFavoritos.has(id),
      alternarFavorito: (id: string) =>
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
    }),
    [idsFavoritos],
  );

  return <ContextoFavoritos.Provider value={value}>{children}</ContextoFavoritos.Provider>;
}

export function usarFavoritos() {
  const ctx = useContext(ContextoFavoritos);
  if (!ctx) throw new Error('usarFavoritos must be used within a ProvedorFavoritos');
  return ctx;
}
