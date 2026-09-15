import React, { createContext, useContext, useMemo, useState } from 'react';

export interface Reserva {
  stationId: string;
  startHour: number;
  endHour: number;
  createdAt: string;
}

interface ValorContextoReservas {
  reservas: Record<string, Reserva>;
  reservaDaEstacao: (stationId: string) => Reserva | undefined;
  criarReserva: (stationId: string, startHour: number, endHour: number) => void;
  cancelarReserva: (stationId: string) => void;
}

const ContextoReservas = createContext<ValorContextoReservas | null>(null);

export function ProvedorReservas({ children }: { children: React.ReactNode }) {
  const [reservas, setReservas] = useState<Record<string, Reserva>>({});

  const value = useMemo(
    () => ({
      reservas,
      reservaDaEstacao: (stationId: string) => reservas[stationId],
      criarReserva: (stationId: string, startHour: number, endHour: number) =>
        setReservas((prev) => ({
          ...prev,
          [stationId]: { stationId, startHour, endHour, createdAt: new Date().toISOString() },
        })),
      cancelarReserva: (stationId: string) =>
        setReservas((prev) => {
          const next = { ...prev };
          delete next[stationId];
          return next;
        }),
    }),
    [reservas],
  );

  return <ContextoReservas.Provider value={value}>{children}</ContextoReservas.Provider>;
}

export function usarReservas() {
  const ctx = useContext(ContextoReservas);
  if (!ctx) throw new Error('usarReservas must be used within a ProvedorReservas');
  return ctx;
}
