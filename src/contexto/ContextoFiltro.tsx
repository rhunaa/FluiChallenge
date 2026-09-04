import React, { createContext, useContext, useMemo, useState } from 'react';
import { EstadoFiltro } from '../tipos';
import { FILTROS_PADRAO } from '../utilitarios/filtrarEstacoes';

interface ValorContextoFiltro {
  filters: EstadoFiltro;
  setFilters: (filters: EstadoFiltro) => void;
  resetarFiltros: () => void;
}

const ContextoFiltro = createContext<ValorContextoFiltro | null>(null);

export function ProvedorFiltro({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<EstadoFiltro>(FILTROS_PADRAO);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetarFiltros: () => setFilters(FILTROS_PADRAO),
    }),
    [filters],
  );

  return <ContextoFiltro.Provider value={value}>{children}</ContextoFiltro.Provider>;
}

export function usarFiltros() {
  const ctx = useContext(ContextoFiltro);
  if (!ctx) throw new Error('usarFiltros must be used within a ProvedorFiltro');
  return ctx;
}
