import { Avaliacao } from '../tipos';

export const avaliacoesIniciais: Avaliacao[] = [
  {
    id: 'rv-1',
    stationId: 'st-2',
    authorName: 'Marina Alves',
    mood: 5,
    ratings: { availability: 4, queue: 4, speed: 5, comfort: 5, value: 3 },
    comment:
      'Esse posto de recarga é muito rápido, mesmo com fila compensa muito, e o local está limpo e organizado perto das lojas.',
    createdAt: 'há 2 horas',
    comments: 40,
  },
  {
    id: 'rv-2',
    stationId: 'st-1',
    authorName: 'Rafael Costa',
    mood: 4,
    ratings: { availability: 5, queue: 3, speed: 4, comfort: 4, value: 4 },
    comment: 'Fácil de achar vaga na Praça da Sé, mas no horário de pico a fila cresce bastante.',
    createdAt: 'há 5 horas',
    comments: 12,
  },
  {
    id: 'rv-3',
    stationId: 'st-5',
    authorName: 'Juliana Prado',
    mood: 5,
    ratings: { availability: 5, queue: 5, speed: 4, comfort: 5, value: 5 },
    comment: 'Melhor experiência até agora: 24h, cafeteria do lado e nunca peguei fila de madrugada.',
    createdAt: 'há 1 dia',
    comments: 8,
  },
];
