import React, { createContext, useContext, useMemo, useState } from 'react';

export interface Usuario {
  name: string;
  email: string;
  carModel?: string;
}

interface ValorContextoAutenticacao {
  usuario: Usuario | null;
  logado: boolean;
  entrar: (email: string, senha: string) => void;
  cadastrar: (dados: { name: string; email: string; senha: string; carModel?: string }) => void;
  sair: () => void;
}

const ContextoAutenticacao = createContext<ValorContextoAutenticacao | null>(null);

function nomeAPartirDoEmail(email: string): string {
  const usuarioParte = email.split('@')[0] ?? 'Motorista';
  return usuarioParte
    .split(/[._-]/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}

export function ProvedorAutenticacao({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const value = useMemo<ValorContextoAutenticacao>(
    () => ({
      usuario,
      logado: usuario !== null,
      entrar: (email) => setUsuario({ name: nomeAPartirDoEmail(email), email }),
      cadastrar: ({ name, email, carModel }) => setUsuario({ name, email, carModel }),
      sair: () => setUsuario(null),
    }),
    [usuario],
  );

  return <ContextoAutenticacao.Provider value={value}>{children}</ContextoAutenticacao.Provider>;
}

export function usarAutenticacao() {
  const ctx = useContext(ContextoAutenticacao);
  if (!ctx) throw new Error('usarAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
  return ctx;
}
