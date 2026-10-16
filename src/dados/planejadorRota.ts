import { Conector, Estacao, TipoConector } from '../tipos';
export interface EtapaRota {
  estacao: Estacao;
  conector: Conector;
  distanciaTrechoKm: number;
}
export interface ResultadoRota {
  viavel: boolean;
  paradas: EtapaRota[];
  trechoFinalKm: number;
  distanciaTotalKm: number;
  modelo: 'corredor-demonstrativo';
  motivo?: string;
  margemSeguranca: number;
}
export interface OpcoesRota {
  tipoConector: TipoConector;
  margemSeguranca?: number;
  autonomiaAposRecargaKm?: number;
}

/** Closed demo corridor only. Never treats radial distanceKm as road distance. */
export function planejarRota(
  destino: Estacao,
  autonomiaKm: number,
  todasEstacoes: Estacao[],
  options: OpcoesRota = { tipoConector: 'CCS Combo2', margemSeguranca: 0.1 },
): ResultadoRota {
  const margem = options.margemSeguranca ?? 0.1;
  const total = destino.demoRouteKm ?? 0;
  const result: ResultadoRota = {
    viavel: false,
    paradas: [],
    trechoFinalKm: total,
    distanciaTotalKm: total,
    modelo: 'corredor-demonstrativo',
    margemSeguranca: margem,
  };
  const fail = (motivo: string) => ({ ...result, motivo });
  if (
    !Number.isFinite(autonomiaKm) ||
    autonomiaKm <= 0 ||
    margem < 0 ||
    margem >= 1 ||
    !Number.isFinite(margem)
  )
    return fail('Informe uma autonomia válida e uma margem de segurança.');
  if (!Number.isFinite(total) || total <= 0)
    return fail('Não existe trajeto verificável nem posição neste corredor demonstrativo.');
  const compativeis = (s: Estacao) =>
    s.connectors
      .filter((c) => c.type === options.tipoConector && c.status === 'available')
      .sort((a, b) => b.powerKw - a.powerKw);
  if (!compativeis(destino).length)
    return fail('O destino não tem conector compatível disponível neste cenário.');
  const depois = options.autonomiaAposRecargaKm ?? autonomiaKm;
  if (!Number.isFinite(depois) || depois <= 0)
    return fail('A autonomia após recarga precisa ser informada corretamente.');
  const candidates = todasEstacoes
    .filter(
      (s) =>
        s.id !== destino.id &&
        Number.isFinite(s.demoRouteKm) &&
        s.demoRouteKm! > 0 &&
        s.demoRouteKm! < total &&
        compativeis(s).length > 0,
    )
    .sort((a, b) => a.demoRouteKm! - b.demoRouteKm!);
  let position = 0;
  let alcance = autonomiaKm * (1 - margem);
  while (total - position > alcance + 1e-9) {
    const reachable = candidates.filter(
      (s) => s.demoRouteKm! > position && s.demoRouteKm! - position <= alcance + 1e-9,
    );
    const next = reachable[reachable.length - 1];
    if (!next)
      return fail(
        'Não há uma parada compatível ao alcance com a margem de segurança escolhida.',
      );
    result.paradas.push({
      estacao: next,
      conector: compativeis(next)[0],
      distanciaTrechoKm: next.demoRouteKm! - position,
    });
    position = next.demoRouteKm!;
    alcance = depois * (1 - margem);
    result.trechoFinalKm = total - position;
  }
  return { ...result, viavel: true, trechoFinalKm: total - position };
}

/** No universal ETA. Explicit assumptions are mandatory, otherwise not informed. */
export function estimarDuracaoViagemMin(
  distancia: number,
  numParadas: number,
  premissas?: { velocidadeMediaKmh: number; minutosPorRecarga: number },
): number | null {
  if (
    !premissas ||
    premissas.velocidadeMediaKmh <= 0 ||
    premissas.minutosPorRecarga < 0 ||
    !Number.isFinite(distancia) ||
    distancia < 0
  )
    return null;
  return Math.round(
    (distancia / premissas.velocidadeMediaKmh) * 60 + numParadas * premissas.minutosPorRecarga,
  );
}
export function formatarDuracaoMin(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60),
    m = minutos % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}
