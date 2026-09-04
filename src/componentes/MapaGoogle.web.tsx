import React from 'react';
import { MapaEstilizado } from './MapaEstilizado';
import { Estacao } from '../tipos';

interface MapaGoogleProps {
  estacoes: Estacao[];
  selectedId: string | null;
  fadedIds: Set<string>;
  onSelectStation: (id: string) => void;
}

// O react-native-maps não tem versão web, então o preview no navegador
// continua usando o mapa estilizado (MapaEstilizado). No iOS/Android entra
// o mapa real do Google Maps — veja MapaGoogle.native.tsx.
export function MapaGoogle(props: MapaGoogleProps) {
  return <MapaEstilizado {...props} />;
}
