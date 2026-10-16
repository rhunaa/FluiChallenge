import React, { createContext, useContext, useState } from 'react';
import { ResultadoRota } from '../dados/planejadorRota';
interface Plano {
  destinoId: string;
  autonomiaKm: number;
  tipoConector: string;
  resultado: ResultadoRota;
}
const Contexto = createContext<{
  plano: Plano | null;
  salvarPlano: (p: Plano | null) => void;
} | null>(null);
export function ProvedorViagem({ children }: { children: React.ReactNode }) {
  const [plano, salvarPlano] = useState<Plano | null>(null);
  return <Contexto.Provider value={{ plano, salvarPlano }}>{children}</Contexto.Provider>;
}
export function usarViagem() {
  const value = useContext(Contexto);
  if (!value) throw new Error('usarViagem requer ProvedorViagem');
  return value;
}
