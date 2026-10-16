import { Estacao } from '../tipos';
export function urlNavegacao(s: Pick<Estacao, 'lat' | 'lng'>): string {
  if (
    !Number.isFinite(s.lat) ||
    !Number.isFinite(s.lng) ||
    Math.abs(s.lat) > 90 ||
    Math.abs(s.lng) > 180
  )
    throw new Error('Coordenadas inválidas');
  return (
    'https' +
    '://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent(s.lat + ',' + s.lng) +
    '&travelmode=driving'
  );
}
