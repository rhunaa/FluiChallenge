import React, { createContext, useContext, useMemo, useState } from 'react';
import { Avaliacao } from '../tipos';
import { avaliacoesIniciais } from '../dados/avaliacoes';
import { usarAutenticacao } from './ContextoAutenticacao';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { avaliacaoValida } from '../utilitarios/avaliacoes';
interface ValorContextoAvaliacoes {
  reviews: Avaliacao[];
  adicionarAvaliacao: (
    review: Omit<Avaliacao, 'id' | 'createdAt' | 'comments' | 'authorId' | 'authorName'> & {
      authorName?: string;
    },
  ) => boolean;
}
const ContextoAvaliacoes = createContext<ValorContextoAvaliacoes | null>(null);
export function ProvedorAvaliacoes({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Avaliacao[]>(avaliacoesIniciais);
  const { usuario } = usarAutenticacao();
  const value = useMemo<ValorContextoAvaliacoes>(
    () => ({
      reviews,
      adicionarAvaliacao: (review) => {
        if (!usuario || !buscarEstacaoPorId(review.stationId) || !avaliacaoValida(review))
          return false;
        setReviews((prev) => [
          {
            ...review,
            comment: review.comment.trim(),
            authorId: usuario.id,
            authorName: usuario.name,
            id: `rv-${Date.now()}-${prev.length}`,
            createdAt: new Date().toISOString(),
            comments: 0,
          },
          ...prev,
        ]);
        return true;
      },
    }),
    [reviews, usuario],
  );
  return <ContextoAvaliacoes.Provider value={value}>{children}</ContextoAvaliacoes.Provider>;
}
export function usarAvaliacoes() {
  const ctx = useContext(ContextoAvaliacoes);
  if (!ctx) throw new Error('usarAvaliacoes requer ProvedorAvaliacoes');
  return ctx;
}
