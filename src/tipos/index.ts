export type TipoConector = 'CCS Combo2' | 'CHAdeMO' | 'Tipo 2' | 'Tesla NACS';

export type StatusEstacao = 'available' | 'busy' | 'offline';

export interface Conector {
  id: string;
  type: TipoConector;
  powerKw: number;
  status: StatusEstacao;
}

export type ChaveComodidade =
  | 'wifi'
  | 'cafe'
  | 'restroom'
  | 'shopping'
  | 'food'
  | 'parking';

export interface Comodidade {
  key: ChaveComodidade;
  label: string;
}

export interface Estacao {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  status: StatusEstacao;
  x: number; // posição 0-1 na tela estilizada do mapa
  y: number; // posição 0-1 na tela estilizada do mapa
  lat: number;
  lng: number;
  connectors: Conector[];
  amenities: ChaveComodidade[];
  openHours: string;
  is24h: boolean;
  rating: number;
  /** taxa de ocupação de 0 a 1 para cada hora do dia, usada para calcular o "menor movimento" */
  hourlyOccupancy: number[];
}

export interface EstadoFiltro {
  connectorTypes: TipoConector[];
  minPower: number | null;
  amenities: ChaveComodidade[];
  hoursMode: 'any' | '24h' | 'commercial';
}

export interface CategoriasAvaliacao {
  availability: number;
  queue: number;
  speed: number;
  comfort: number;
  value: number;
}

export interface Avaliacao {
  id: string;
  stationId: string;
  authorName: string;
  mood: number; // 1 a 5
  ratings: CategoriasAvaliacao;
  comment: string;
  createdAt: string;
  comments: number;
}

export const ROTULOS_CATEGORIA_AVALIACAO: Record<keyof CategoriasAvaliacao, { label: string; hint: string }> = {
  availability: { label: 'Disponibilidade', hint: 'Fácil encontrar um carregador livre?' },
  queue: { label: 'Fila / Espera', hint: 'Quanto tempo você esperou na fila?' },
  speed: { label: 'Velocidade de recarga', hint: 'A recarga foi tão rápida quanto esperado?' },
  comfort: { label: 'Conforto do local', hint: 'Espaço limpo, seguro e agradável?' },
  value: { label: 'Preço / Custo-benefício', hint: 'O preço cobrado valeu a pena?' },
};

export const ROTULOS_COMODIDADE: Record<ChaveComodidade, string> = {
  wifi: 'Wi-Fi',
  cafe: 'Café',
  restroom: 'Banheiro',
  shopping: 'Loja',
  food: 'Praça de alimentação',
  parking: 'Estacionamento',
};
