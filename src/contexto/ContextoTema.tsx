import React, { createContext, useContext, useMemo, useState } from 'react';
import { coresClaras, coresEscuras, CoresTema, ModoTema } from '../tema/tema';

const ESCALAS_FONTE = [1, 1.15, 1.3] as const;
const RÓTULOS_ESCALA = ['Normal', 'Grande', 'Muito grande'] as const;

interface ContextoTemaValue {
  modo: ModoTema;
  colors: CoresTema;
  alternarModo: () => void;
  fontScale: number;
  fontScaleLabel: string;
  aumentarFonte: () => void;
  diminuirFonte: () => void;
  podeAumentarFonte: boolean;
  podeDiminuirFonte: boolean;
}

const ContextoTema = createContext<ContextoTemaValue | null>(null);

export function ProvedorTema({ children }: { children: React.ReactNode }) {
  const [modo, setModo] = useState<ModoTema>('dark');
  const [escalaIndex, setEscalaIndex] = useState(0);

  const value = useMemo<ContextoTemaValue>(
    () => ({
      modo,
      colors: modo === 'dark' ? coresEscuras : coresClaras,
      alternarModo: () => setModo((m) => (m === 'dark' ? 'light' : 'dark')),
      fontScale: ESCALAS_FONTE[escalaIndex],
      fontScaleLabel: RÓTULOS_ESCALA[escalaIndex],
      aumentarFonte: () => setEscalaIndex((i) => Math.min(i + 1, ESCALAS_FONTE.length - 1)),
      diminuirFonte: () => setEscalaIndex((i) => Math.max(i - 1, 0)),
      podeAumentarFonte: escalaIndex < ESCALAS_FONTE.length - 1,
      podeDiminuirFonte: escalaIndex > 0,
    }),
    [modo, escalaIndex],
  );

  return <ContextoTema.Provider value={value}>{children}</ContextoTema.Provider>;
}

export function usarTema() {
  const ctx = useContext(ContextoTema);
  if (!ctx) throw new Error('usarTema deve ser usado dentro de um ProvedorTema');
  return ctx;
}
