import React, { createContext, useContext, useMemo, useState } from 'react';
import { Avaliacao } from '../tipos';
import { avaliacoesIniciais } from '../dados/avaliacoes';

interface ValorContextoAvaliacoes {
  reviews: Avaliacao[];
  adicionarAvaliacao: (review: Omit<Avaliacao, 'id' | 'createdAt' | 'comments'>) => void;
}

const ContextoAvaliacoes = createContext<ValorContextoAvaliacoes | null>(null);

export function ProvedorAvaliacoes({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Avaliacao[]>(avaliacoesIniciais);

  const value = useMemo(
    () => ({
      reviews,
      adicionarAvaliacao: (review: Omit<Avaliacao, 'id' | 'createdAt' | 'comments'>) => {
        setReviews((prev) => [
          {
            ...review,
            id: `rv-${Date.now()}`,
            createdAt: 'agora mesmo',
            comments: 0,
          },
          ...prev,
        ]);
      },
    }),
    [reviews],
  );

  return <ContextoAvaliacoes.Provider value={value}>{children}</ContextoAvaliacoes.Provider>;
}

export function usarAvaliacoes() {
  const ctx = useContext(ContextoAvaliacoes);
  if (!ctx) throw new Error('usarAvaliacoes must be used within a ProvedorAvaliacoes');
  return ctx;
}
