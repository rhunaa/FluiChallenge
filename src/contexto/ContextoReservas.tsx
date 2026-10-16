import React, { createContext, useContext, useMemo, useState } from 'react';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { usarAutenticacao } from './ContextoAutenticacao';
import { horarioValido, intervaloAgendamento } from '../utilitarios/horarios';
export interface Reserva {
  stationId: string;
  connectorId: string;
  date: string;
  startHour: number;
  endHour: number;
  startAt: string;
  endAt: string;
  createdAt: string;
  demonstrativa: true;
}
interface ValorContextoReservas {
  reservas: Record<string, Reserva>;
  reservaDaEstacao: (stationId: string) => Reserva | undefined;
  criarReserva: (
    stationId: string,
    startHour: number,
    endHour: number,
    date: string,
    connectorId: string,
  ) => boolean;
  cancelarReserva: (stationId: string) => void;
}
const ContextoReservas = createContext<ValorContextoReservas | null>(null);
export function ProvedorReservas({ children }: { children: React.ReactNode }) {
  const [reservas, setReservas] = useState<Record<string, Reserva>>({});
  const { usuario } = usarAutenticacao();
  const value = useMemo<ValorContextoReservas>(
    () => ({
      reservas,
      reservaDaEstacao: (id) => reservas[id],
      criarReserva: (stationId, startHour, endHour, date, connectorId) => {
        const station = buscarEstacaoPorId(stationId);
        if (
          !station ||
          !usuario ||
          !horarioValido(station, date, connectorId, usuario.tipoConector, startHour, endHour)
        )
          return false;
        const intervalo = intervaloAgendamento(date, startHour, endHour)!;
        if (
          Object.values(reservas).some(
            (r) =>
              r.stationId !== stationId &&
              new Date(r.startAt) < intervalo.fim &&
              intervalo.inicio < new Date(r.endAt),
          )
        )
          return false;
        setReservas((prev) => ({
          ...prev,
          [stationId]: {
            stationId,
            connectorId,
            date,
            startHour,
            endHour,
            startAt: intervalo.inicio.toISOString(),
            endAt: intervalo.fim.toISOString(),
            createdAt: new Date().toISOString(),
            demonstrativa: true,
          },
        }));
        return true;
      },
      cancelarReserva: (id) =>
        setReservas((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        }),
    }),
    [reservas, usuario],
  );
  return <ContextoReservas.Provider value={value}>{children}</ContextoReservas.Provider>;
}
export function usarReservas() {
  const ctx = useContext(ContextoReservas);
  if (!ctx) throw new Error('usarReservas requer ProvedorReservas');
  return ctx;
}
