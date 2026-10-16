/* Estado do mapa da aba Mapa. O texto curto aparece na folha da tela, nunca por cima do mapa. */
export type FaseMapa = 'ilustrativo' | 'carregando' | 'pronto' | 'lento' | 'recusado';
export type EstadoMapa = { fase: FaseMapa; tentarDeNovo?: () => void };
