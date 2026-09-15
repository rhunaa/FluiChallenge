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
  imageUrl: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  connectors: Conector[];
  amenities: ChaveComodidade[];
  openHours: string;
  is24h: boolean;
  rating: number;
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
  mood: number;
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

export interface SessaoRecarga {
  id: string;
  stationId: string;
  connectorType: TipoConector;
  date: string;
  durationMin: number;
  energyKwh: number;
  cost: number;
}

export const ROTULOS_COMODIDADE: Record<ChaveComodidade, string> = {
  wifi: 'Wi-Fi',
  cafe: 'Café',
  restroom: 'Banheiro',
  shopping: 'Loja',
  food: 'Praça de alimentação',
  parking: 'Estacionamento',
};

export type CategoriaLocalProximo = 'cafe' | 'food' | 'shopping';

export interface LocalProximo {
  id: string;
  name: string;
  category: CategoriaLocalProximo;
  walkMin: number;
  rating: number;
  imageUrl: string;
}
