import { SessaoRecarga } from '../tipos';

export const historico: SessaoRecarga[] = [
  {
    id: 'hs-1',
    stationId: 'st-1',
    connectorType: 'CCS Combo2',
    date: '2026-09-08T08:15:00',
    durationMin: 32,
    energyKwh: 28.4,
    cost: 42.6,
  },
  {
    id: 'hs-2',
    stationId: 'st-5',
    connectorType: 'Tesla NACS',
    date: '2026-09-05T19:40:00',
    durationMin: 21,
    energyKwh: 24.1,
    cost: 36.15,
  },
  {
    id: 'hs-3',
    stationId: 'st-2',
    connectorType: 'CCS Combo2',
    date: '2026-08-30T13:05:00',
    durationMin: 45,
    energyKwh: 38.7,
    cost: 58.05,
  },
  {
    id: 'hs-4',
    stationId: 'st-1',
    connectorType: 'Tipo 2',
    date: '2026-08-24T07:50:00',
    durationMin: 58,
    energyKwh: 18.2,
    cost: 27.3,
  },
  {
    id: 'hs-5',
    stationId: 'st-7',
    connectorType: 'CCS Combo2',
    date: '2026-08-19T17:22:00',
    durationMin: 27,
    energyKwh: 22.9,
    cost: 34.35,
  },
  {
    id: 'hs-6',
    stationId: 'st-3',
    connectorType: 'Tesla NACS',
    date: '2026-08-12T09:10:00',
    durationMin: 18,
    energyKwh: 31.5,
    cost: 47.25,
  },
];

export function calcularResumoHistorico(sessoes: SessaoRecarga[]) {
  return sessoes.reduce(
    (resumo, sessao) => ({
      totalEnergiaKwh: resumo.totalEnergiaKwh + sessao.energyKwh,
      totalGasto: resumo.totalGasto + sessao.cost,
      totalSessoes: resumo.totalSessoes + 1,
    }),
    { totalEnergiaKwh: 0, totalGasto: 0, totalSessoes: 0 },
  );
}

export function formatarDataHistorico(iso: string): string {
  const data = new Date(iso);
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dia}, ${hora}`;
}
