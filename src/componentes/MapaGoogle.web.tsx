import React from 'react';
import { MapaEstilizado } from './MapaEstilizado';
import { Estacao } from '../tipos';

interface MapaGoogleProps {
  estacoes: Estacao[];
  selectedId: string | null;
  fadedIds: Set<string>;
  onSelectStation: (id: string) => void;
}

export function MapaGoogle(props: MapaGoogleProps) {
  return <MapaEstilizado {...props} />;
}
