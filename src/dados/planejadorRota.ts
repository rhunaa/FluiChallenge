import { Estacao } from '../tipos';

export interface EtapaRota {
  estacao: Estacao;
  distanciaTrechoKm: number;
}

export interface ResultadoRota {
  viavel: boolean;
  paradas: EtapaRota[];
  trechoFinalKm: number;
  distanciaTotalKm: number;
}

export function planejarRota(destino: Estacao, autonomiaKm: number, todasEstacoes: Estacao[]): ResultadoRota {
  const candidatas = todasEstacoes
    .filter((estacao) => estacao.id !== destino.id && estacao.status !== 'offline' && estacao.distanceKm < destino.distanceKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const paradas: EtapaRota[] = [];
  let posicaoAtual = 0;
  let indiceCandidata = 0;

  while (destino.distanceKm - posicaoAtual > autonomiaKm) {
    let melhor: Estacao | null = null;
    while (indiceCandidata < candidatas.length && candidatas[indiceCandidata].distanceKm - posicaoAtual <= autonomiaKm) {
      melhor = candidatas[indiceCandidata];
      indiceCandidata++;
    }

    if (!melhor) {
      return {
        viavel: false,
        paradas,
        trechoFinalKm: destino.distanceKm - posicaoAtual,
        distanciaTotalKm: destino.distanceKm,
      };
    }

    paradas.push({ estacao: melhor, distanciaTrechoKm: melhor.distanceKm - posicaoAtual });
    posicaoAtual = melhor.distanceKm;
  }

  return {
    viavel: true,
    paradas,
    trechoFinalKm: destino.distanceKm - posicaoAtual,
    distanciaTotalKm: destino.distanceKm,
  };
}

const VELOCIDADE_MEDIA_KMH = 35;
const MINUTOS_POR_RECARGA = 35;

export function estimarDuracaoViagemMin(distanciaTotalKm: number, numParadas: number): number {
  const minutosDirigindo = (distanciaTotalKm / VELOCIDADE_MEDIA_KMH) * 60;
  const minutosRecarga = numParadas * MINUTOS_POR_RECARGA;
  return Math.round(minutosDirigindo + minutosRecarga);
}

export function formatarDuracaoMin(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, '0')}`;
}
