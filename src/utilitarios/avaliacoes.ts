import { Avaliacao, CategoriasAvaliacao } from '../tipos';
const keys: (keyof CategoriasAvaliacao)[] = [
  'availability',
  'queue',
  'speed',
  'comfort',
  'value',
];
export function avaliacaoValida(v: {
  mood?: number;
  ratings?: Partial<CategoriasAvaliacao>;
  comment?: unknown;
}): boolean {
  return (
    v.mood != null &&
    Number.isInteger(v.mood) &&
    v.mood >= 1 &&
    v.mood <= 5 &&
    !!v.ratings &&
    Object.keys(v.ratings).length === 5 &&
    keys.every((k) => {
      const n = v.ratings?.[k];
      return n != null && Number.isInteger(n) && n >= 1 && n <= 5;
    }) &&
    typeof v.comment === 'string' &&
    v.comment.length <= 500
  );
}
export function mediaAvaliacao(r: Avaliacao): number {
  return keys.reduce((s, k) => s + r.ratings[k], 0) / keys.length;
}
export function resumoAvaliacoes(
  reviews: Avaliacao[],
  stationId: string,
): { nota: number | null; quantidade: number } {
  const list = reviews.filter((r) => r.stationId === stationId);
  return {
    quantidade: list.length,
    nota: list.length ? list.reduce((s, r) => s + mediaAvaliacao(r), 0) / list.length : null,
  };
}
