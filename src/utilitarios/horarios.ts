import { Estacao } from '../tipos';

type Funcionamento = Pick<Estacao, 'openHours' | 'is24h'>;
export interface JanelaOcupacao {
  start: number;
  end: number;
  avg: number;
  endDayOffset: number;
}

export function dataLocal(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDataLocal(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
    ? date
    : null;
}

export function proximaData(dias = 1): string {
  const date = new Date();
  date.setDate(date.getDate() + dias);
  return dataLocal(date);
}

export function formatarData(value: string): string {
  const date = parseDataLocal(value);
  return date
    ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : value;
}

export function formatarHora(h: number): string {
  const hour = ((h % 24) + 24) % 24;
  const inteiro = Math.floor(hour);
  const minutos = Math.round((hour - inteiro) * 60);
  return `${String(inteiro).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

export function intervaloFuncionamento(station: Funcionamento): [number, number] | null {
  if (station.is24h) return [0, 24];
  const times = station.openHours.match(/\d{1,2}:\d{2}/g);
  if (!times || times.length !== 2) return null;
  const [a, b] = times.map((t) => {
    const [h, m] = t.split(':').map(Number);
    return h >= 0 && h < 24 && m >= 0 && m < 60 ? h + m / 60 : NaN;
  });
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    a < 0 ||
    a >= 24 ||
    b < 0 ||
    b >= 24 ||
    a === b
  )
    return null;
  return [a, b > a ? b : b + 24];
}

export function dentroDoFuncionamento(
  station: Funcionamento,
  start: number,
  end: number,
): boolean {
  const range = intervaloFuncionamento(station);
  if (
    !range ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    start >= 24 ||
    end <= start ||
    end - start > 24
  )
    return false;
  if (station.is24h) return true;
  const [open, close] = range;
  return (
    (start >= open && end <= close) || (close > 24 && start < close - 24 && end <= close - 24)
  );
}

export function intervalosSobrepostos(
  a: { start: number; end: number },
  b: { start: number; end: number },
): boolean {
  for (const offset of [-24, 0, 24])
    if (a.start < b.end + offset && b.start + offset < a.end) return true;
  return false;
}

export function obterMelhoresJanelas(
  occupancy: number[],
  quantidade = 3,
  duracaoHoras = 2,
  station: Funcionamento = { is24h: true, openHours: '24 horas' },
  date?: string,
  now = new Date(),
): JanelaOcupacao[] {
  if (
    occupancy.length !== 24 ||
    occupancy.some((v) => !Number.isFinite(v) || v < 0 || v > 1) ||
    !Number.isInteger(duracaoHoras) ||
    duracaoHoras < 1 ||
    duracaoHoras > 24 ||
    quantidade <= 0
  )
    return [];
  const dia = date ? parseDataLocal(date) : null;
  if (date && !dia) return [];
  const candidates: (JanelaOcupacao & { absoluteEnd: number })[] = [];
  for (let start = 0; start < 24; start++) {
    const end = start + duracaoHoras;
    if (!dentroDoFuncionamento(station, start, end)) continue;
    if (dia) {
      const inicio = new Date(dia);
      inicio.setHours(start, 0, 0, 0);
      if (inicio.getTime() <= now.getTime()) continue;
    }
    let sum = 0;
    for (let i = 0; i < duracaoHoras; i++) sum += occupancy[(start + i) % 24];
    candidates.push({
      start,
      end: end % 24,
      endDayOffset: Math.floor(end / 24),
      avg: sum / duracaoHoras,
      absoluteEnd: end,
    });
  }
  candidates.sort((a, b) => a.avg - b.avg || a.start - b.start);
  const chosen: typeof candidates = [];
  for (const c of candidates) {
    if (
      !chosen.some((e) =>
        intervalosSobrepostos(
          { start: e.start, end: e.absoluteEnd },
          { start: c.start, end: c.absoluteEnd },
        ),
      )
    )
      chosen.push(c);
    if (chosen.length >= quantidade) break;
  }
  return chosen.sort((a, b) => a.start - b.start).map(({ absoluteEnd, ...c }) => c);
}

export function obterHorarioMenosMovimentado(occupancy: number[]): {
  start: number;
  end: number;
} {
  const janela = obterMelhoresJanelas(occupancy, 1, 3)[0];
  return janela ? { start: janela.start, end: janela.end } : { start: 0, end: 0 };
}

export function intervaloAgendamento(
  date: string,
  startHour: number,
  endHour: number,
): { inicio: Date; fim: Date } | null {
  const dia = parseDataLocal(date);
  if (
    !dia ||
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    startHour > 23 ||
    endHour < 0 ||
    endHour > 23 ||
    startHour === endHour
  )
    return null;
  const inicio = new Date(dia);
  inicio.setHours(startHour, 0, 0, 0);
  const fim = new Date(dia);
  fim.setHours(endHour, 0, 0, 0);
  if (endHour <= startHour) fim.setDate(fim.getDate() + 1);
  return { inicio, fim };
}

export function horarioValido(
  station: Estacao,
  date: string,
  connectorId: string,
  tipoVeiculo: string,
  startHour: number,
  endHour: number,
  now = new Date(),
): boolean {
  const connector = station.connectors.find(
    (c) => c.id === connectorId && c.type === tipoVeiculo && c.status === 'available',
  );
  const interval = intervaloAgendamento(date, startHour, endHour);
  if (!connector || !interval || interval.inicio.getTime() <= now.getTime()) return false;
  const end = startHour + ((endHour - startHour + 24) % 24);
  return dentroDoFuncionamento(station, startHour, end);
}
