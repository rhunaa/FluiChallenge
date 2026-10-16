import { Conector, EstadoFiltro, Estacao, StatusEstacao, TipoConector } from '../tipos';

export const FILTROS_PADRAO: EstadoFiltro = {
  connectorTypes: [],
  minPower: null,
  amenities: [],
  hoursMode: 'any',
  onlyAvailable: false,
  compatibleOnly: true,
};

export function conectorAtende(
  c: Conector,
  filters: EstadoFiltro,
  tipoVeiculo?: TipoConector,
): boolean {
  return (
    (!filters.connectorTypes.length || filters.connectorTypes.includes(c.type)) &&
    (filters.minPower == null || c.powerKw >= filters.minPower) &&
    (!filters.onlyAvailable || c.status === 'available') &&
    (!filters.compatibleOnly || (!!tipoVeiculo && c.type === tipoVeiculo))
  );
}

export function conectoresCorrespondentes(
  station: Estacao,
  filters: EstadoFiltro,
  tipoVeiculo?: TipoConector,
): Conector[] {
  return station.connectors.filter((c) => conectorAtende(c, filters, tipoVeiculo));
}

export function aplicarFiltros(
  estacoes: Estacao[],
  filters: EstadoFiltro,
  tipoVeiculo?: TipoConector,
): Estacao[] {
  return estacoes.filter(
    (station) =>
      conectoresCorrespondentes(station, filters, tipoVeiculo).length > 0 &&
      filters.amenities.every((a) => station.amenities.includes(a)) &&
      (filters.hoursMode !== '24h' || station.is24h) &&
      (filters.hoursMode !== 'commercial' || !station.is24h),
  );
}

export function statusDosConectores(connectors: Conector[]): StatusEstacao {
  if (connectors.some((c) => c.status === 'available')) return 'available';
  if (connectors.some((c) => c.status === 'busy')) return 'busy';
  return 'offline';
}

export function contarFiltrosAtivos(filters: EstadoFiltro): number {
  return (
    filters.connectorTypes.length +
    filters.amenities.length +
    (filters.minPower != null ? 1 : 0) +
    (filters.hoursMode !== 'any' ? 1 : 0) +
    (filters.onlyAvailable ? 1 : 0) +
    (filters.compatibleOnly ? 1 : 0)
  );
}

export function normalizarBusca(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR');
}

export function buscarEstacoes(stations: Estacao[], query: string): Estacao[] {
  const q = normalizarBusca(query);
  return !q
    ? stations
    : stations.filter((s) => normalizarBusca(`${s.name} ${s.address}`).includes(q));
}
