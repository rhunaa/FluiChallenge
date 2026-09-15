import { LocalProximo } from '../tipos';

export const locaisProximosPorEstacao: Record<string, LocalProximo[]> = {
  'st-1': [
    {
      id: 'lp-1',
      name: 'Café Bom Retiro',
      category: 'cafe',
      walkMin: 3,
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 'lp-2',
      name: 'Padaria Estrela',
      category: 'food',
      walkMin: 5,
      rating: 4.3,
      imageUrl: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80&auto=format&fit=crop',
    },
  ],
  'st-2': [
    {
      id: 'lp-3',
      name: 'Praça de Alimentação Vila Verde',
      category: 'food',
      walkMin: 2,
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 'lp-4',
      name: 'Livraria Cultura Vila Verde',
      category: 'shopping',
      walkMin: 4,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1701852965474-35ad0d54a0b4?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 'lp-5',
      name: 'Cafeteria Grão Nobre',
      category: 'cafe',
      walkMin: 3,
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1545418314-7ce0b9b53901?w=600&q=80&auto=format&fit=crop',
    },
  ],
  'st-3': [
    {
      id: 'lp-6',
      name: 'Restaurante da Estrada',
      category: 'food',
      walkMin: 5,
      rating: 4.2,
      imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80&auto=format&fit=crop',
    },
  ],
  'st-5': [
    {
      id: 'lp-7',
      name: 'Café Inovação',
      category: 'cafe',
      walkMin: 2,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80&auto=format&fit=crop',
    },
    {
      id: 'lp-8',
      name: 'Sabor & Cia',
      category: 'food',
      walkMin: 4,
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=600&q=80&auto=format&fit=crop',
    },
  ],
  'st-7': [
    {
      id: 'lp-9',
      name: 'Cafeteria Praça Municipal',
      category: 'cafe',
      walkMin: 3,
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1534432182912-63863115e106?w=600&q=80&auto=format&fit=crop',
    },
  ],
  'st-8': [
    {
      id: 'lp-10',
      name: 'Restaurante Mirante da Serra',
      category: 'food',
      walkMin: 6,
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop',
    },
  ],
};
