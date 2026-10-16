import React, { createContext, useContext, useMemo, useState } from 'react';
import { TipoConector } from '../tipos';
export interface Usuario {
  id: string;
  name: string;
  email: string;
  carModel?: string;
  tipoConector: TipoConector;
  autonomiaKm: number;
  batteryPercent: number;
  demo: true;
}
interface ValorContextoAutenticacao {
  usuario: Usuario | null;
  logado: boolean;
  sessaoId: number;
  entrarDemo: (nome?: string, carModel?: string) => void;
  entrar: (email: string, senha?: string) => void;
  cadastrar: (dados: {
    name: string;
    email?: string;
    senha?: string;
    carModel?: string;
  }) => void;
  atualizarVeiculo: (
    dados: Partial<Pick<Usuario, 'carModel' | 'tipoConector' | 'autonomiaKm'>>,
  ) => void;
  reiniciarDemo: () => void;
  sair: () => void;
}
const ContextoAutenticacao = createContext<ValorContextoAutenticacao | null>(null);
export function ProvedorAutenticacao({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>({
    id: 'demo-1',
    name: 'Visitante Flui',
    email: 'perfil fictício',
    carModel: 'BYD Seal · exemplo',
    tipoConector: 'CCS Combo2',
    autonomiaKm: 80,
    batteryPercent: 76,
    demo: true,
  });
  const [sessaoId, setSessaoId] = useState(1);
  const iniciar = (nome = 'Visitante Flui', carModel = 'BYD Seal · exemplo') => {
    const novo = sessaoId + 1;
    setSessaoId(novo);
    setUsuario({
      id: `demo-${novo}`,
      name: nome.trim() || 'Visitante Flui',
      email: 'perfil fictício',
      carModel: carModel.trim() || 'Veículo demonstrativo',
      tipoConector: 'CCS Combo2',
      autonomiaKm: 80,
      batteryPercent: 76,
      demo: true,
    });
  };
  const value = useMemo<ValorContextoAutenticacao>(
    () => ({
      usuario,
      logado: !!usuario,
      sessaoId,
      entrarDemo: iniciar,
      entrar: () => iniciar(),
      cadastrar: (d) => iniciar(d.name, d.carModel),
      atualizarVeiculo: (d) => setUsuario((u) => (u ? { ...u, ...d } : u)),
      reiniciarDemo: () => iniciar(),
      sair: () => {
        setUsuario(null);
        setSessaoId((v) => v + 1);
      },
    }),
    [usuario, sessaoId],
  );
  return (
    <ContextoAutenticacao.Provider value={value}>{children}</ContextoAutenticacao.Provider>
  );
}
export function usarAutenticacao() {
  const ctx = useContext(ContextoAutenticacao);
  if (!ctx) throw new Error('usarAutenticacao requer ProvedorAutenticacao');
  return ctx;
}
