import { Estacao } from '../tipos';

const commuteCurve = [0.1, 0.05, 0.05, 0.05, 0.1, 0.25, 0.55, 0.8, 0.7, 0.5, 0.45, 0.5, 0.55, 0.5, 0.45, 0.5, 0.6, 0.85, 0.9, 0.7, 0.45, 0.3, 0.2, 0.12];
const mallCurve = [0.05, 0.02, 0.02, 0.02, 0.02, 0.05, 0.1, 0.15, 0.25, 0.4, 0.55, 0.65, 0.75, 0.8, 0.75, 0.7, 0.75, 0.85, 0.9, 0.85, 0.6, 0.35, 0.15, 0.08];
const highwayCurve = [0.3, 0.25, 0.2, 0.2, 0.25, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.7, 0.65, 0.6, 0.65, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3];

export const estacoes: Estacao[] = [
  {
    id: 'st-1',
    name: 'Estação Praça da Sé',
    address: 'Praça da Sé, 100 — Centro',
    distanceKm: 0.8,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600&q=80&auto=format&fit=crop',
    x: 0.32,
    y: 0.28,
    lat: -23.5505,
    lng: -46.6333,
    connectors: [
      { id: 'c1', type: 'CCS Combo2', powerKw: 150, status: 'available' },
      { id: 'c2', type: 'Tipo 2', powerKw: 22, status: 'available' },
    ],
    amenities: ['wifi', 'cafe', 'restroom'],
    openHours: '06:00 – 23:00',
    is24h: false,
    rating: 4.6,
    hourlyOccupancy: commuteCurve,
  },
  {
    id: 'st-2',
    name: 'Shopping Vila Verde',
    address: 'Av. das Nações, 850',
    distanceKm: 2.1,
    status: 'busy',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80&auto=format&fit=crop',
    x: 0.62,
    y: 0.4,
    lat: -23.5605,
    lng: -46.6433,
    connectors: [
      { id: 'c3', type: 'CCS Combo2', powerKw: 100, status: 'busy' },
      { id: 'c4', type: 'CHAdeMO', powerKw: 50, status: 'available' },
      { id: 'c5', type: 'Tipo 2', powerKw: 22, status: 'busy' },
    ],
    amenities: ['shopping', 'food', 'restroom', 'wifi', 'parking'],
    openHours: '10:00 – 22:00',
    is24h: false,
    rating: 4.8,
    hourlyOccupancy: mallCurve,
  },
  {
    id: 'st-3',
    name: 'Posto Rodovia Norte',
    address: 'Rod. BR-101, km 12',
    distanceKm: 8.4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1704475336842-0ab3798abf0e?w=600&q=80&auto=format&fit=crop',
    x: 0.78,
    y: 0.18,
    lat: -23.5405,
    lng: -46.6133,
    connectors: [
      { id: 'c6', type: 'CCS Combo2', powerKw: 180, status: 'available' },
      { id: 'c7', type: 'Tesla NACS', powerKw: 250, status: 'available' },
    ],
    amenities: ['food', 'restroom', 'parking'],
    openHours: '24 horas',
    is24h: true,
    rating: 4.3,
    hourlyOccupancy: highwayCurve,
  },
  {
    id: 'st-4',
    name: 'Estação Jardim das Flores',
    address: 'Rua das Acácias, 220',
    distanceKm: 1.4,
    status: 'offline',
    imageUrl: 'https://images.unsplash.com/photo-1615829386703-e2bb66a7cb7d?w=600&q=80&auto=format&fit=crop',
    x: 0.22,
    y: 0.58,
    lat: -23.5705,
    lng: -46.6533,
    connectors: [
      { id: 'c8', type: 'Tipo 2', powerKw: 22, status: 'offline' },
      { id: 'c9', type: 'CHAdeMO', powerKw: 50, status: 'offline' },
    ],
    amenities: ['wifi'],
    openHours: '07:00 – 21:00',
    is24h: false,
    rating: 4.0,
    hourlyOccupancy: commuteCurve,
  },
  {
    id: 'st-5',
    name: 'Parque Tecnológico Sul',
    address: 'Av. Inovação, 500',
    distanceKm: 3.6,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1671785120538-c24cbe823ccc?w=600&q=80&auto=format&fit=crop',
    x: 0.48,
    y: 0.68,
    lat: -23.5805,
    lng: -46.6233,
    connectors: [
      { id: 'c10', type: 'CCS Combo2', powerKw: 100, status: 'available' },
      { id: 'c11', type: 'Tesla NACS', powerKw: 150, status: 'available' },
      { id: 'c12', type: 'Tipo 2', powerKw: 11, status: 'available' },
    ],
    amenities: ['wifi', 'cafe', 'food', 'restroom'],
    openHours: '24 horas',
    is24h: true,
    rating: 4.9,
    hourlyOccupancy: mallCurve,
  },
  {
    id: 'st-6',
    name: 'Estação Beira-Rio',
    address: 'Marginal do Rio, 45',
    distanceKm: 5.2,
    status: 'busy',
    imageUrl: 'https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?w=600&q=80&auto=format&fit=crop',
    x: 0.68,
    y: 0.75,
    lat: -23.5905,
    lng: -46.6033,
    connectors: [
      { id: 'c13', type: 'CHAdeMO', powerKw: 50, status: 'busy' },
      { id: 'c14', type: 'CCS Combo2', powerKw: 75, status: 'available' },
    ],
    amenities: ['parking', 'restroom'],
    openHours: '08:00 – 20:00',
    is24h: false,
    rating: 4.1,
    hourlyOccupancy: highwayCurve,
  },
  {
    id: 'st-7',
    name: 'Estação Centro Cívico',
    address: 'Praça Municipal, 10',
    distanceKm: 1.1,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1646753020826-c518face72ad?w=600&q=80&auto=format&fit=crop',
    x: 0.4,
    y: 0.15,
    lat: -23.5305,
    lng: -46.6433,
    connectors: [
      { id: 'c15', type: 'Tipo 2', powerKw: 22, status: 'available' },
      { id: 'c16', type: 'CCS Combo2', powerKw: 50, status: 'available' },
    ],
    amenities: ['cafe', 'wifi'],
    openHours: '06:00 – 22:00',
    is24h: false,
    rating: 4.4,
    hourlyOccupancy: commuteCurve,
  },
  {
    id: 'st-8',
    name: 'Estação Alto da Serra',
    address: 'Estrada da Serra, km 3',
    distanceKm: 11.7,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1671785253964-bdb43087ed99?w=600&q=80&auto=format&fit=crop',
    x: 0.85,
    y: 0.55,
    lat: -23.6005,
    lng: -46.5933,
    connectors: [
      { id: 'c17', type: 'Tesla NACS', powerKw: 250, status: 'available' },
    ],
    amenities: ['food', 'parking'],
    openHours: '24 horas',
    is24h: true,
    rating: 4.7,
    hourlyOccupancy: highwayCurve,
  },
];

export function buscarEstacaoPorId(id: string): Estacao | undefined {
  return estacoes.find((s) => s.id === id);
}

export function obterHorarioMenosMovimentado(hourlyOccupancy: number[]): { start: number; end: number } {
  let bestStart = 0;
  let bestAvg = Infinity;
  for (let start = 0; start < 24; start++) {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      sum += hourlyOccupancy[(start + i) % 24];
    }
    const avg = sum / 3;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestStart = start;
    }
  }
  return { start: bestStart, end: (bestStart + 3) % 24 };
}

export interface JanelaOcupacao {
  start: number;
  end: number;
  avg: number;
}

export function obterMelhoresJanelas(
  hourlyOccupancy: number[],
  quantidade = 3,
  duracaoHoras = 2,
): JanelaOcupacao[] {
  const candidatas: JanelaOcupacao[] = [];
  for (let start = 0; start < 24; start++) {
    let sum = 0;
    for (let i = 0; i < duracaoHoras; i++) {
      sum += hourlyOccupancy[(start + i) % 24];
    }
    candidatas.push({ start, end: (start + duracaoHoras) % 24, avg: sum / duracaoHoras });
  }
  candidatas.sort((a, b) => a.avg - b.avg);

  const escolhidas: JanelaOcupacao[] = [];
  for (const candidata of candidatas) {
    const sobrepoe = escolhidas.some((e) => Math.abs(e.start - candidata.start) < duracaoHoras);
    if (!sobrepoe) escolhidas.push(candidata);
    if (escolhidas.length === quantidade) break;
  }
  return escolhidas.sort((a, b) => a.start - b.start);
}
