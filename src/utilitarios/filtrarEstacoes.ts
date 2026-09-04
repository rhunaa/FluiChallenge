import { EstadoFiltro, Estacao } from '../tipos';

export const FILTROS_PADRAO: EstadoFiltro = {
  connectorTypes: [],
  minPower: null,
  amenities: [],
  hoursMode: 'any',
};

export function aplicarFiltros(estacoes: Estacao[], filters: EstadoFiltro): Estacao[] {
  return estacoes.filter((station) => {
    if (filters.connectorTypes.length > 0) {
      const hasType = station.connectors.some((c) => filters.connectorTypes.includes(c.type));
      if (!hasType) return false;
    }

    if (filters.minPower != null) {
      const hasPower = station.connectors.some((c) => c.powerKw >= filters.minPower!);
      if (!hasPower) return false;
    }

    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((a) => station.amenities.includes(a));
      if (!hasAllAmenities) return false;
    }

    if (filters.hoursMode === '24h' && !station.is24h) return false;
    if (filters.hoursMode === 'commercial' && station.is24h) return false;

    return true;
  });
}

export function contarFiltrosAtivos(filters: EstadoFiltro): number {
  return (
    filters.connectorTypes.length +
    filters.amenities.length +
    (filters.minPower != null ? 1 : 0) +
    (filters.hoursMode !== 'any' ? 1 : 0)
  );
}
