import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import { Estacao } from '../tipos';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';
import { usarTema } from '../contexto/ContextoTema';
import {
  conectoresCorrespondentes,
  statusDosConectores,
} from '../utilitarios/filtrarEstacoes';
import { MapaEstilizado } from './MapaEstilizado';
import { Texto } from './Texto';
import { EstadoMapa } from './estadoMapa';
interface Props {
  estacoes: Estacao[];
  selectedId?: string;
  fadedIds?: string[];
  onSelectStation: (id: string) => void;
  /* Mesmo contrato do mapa web: altura total, faixa coberta pela busca no topo e pela folha embaixo. */
  altura?: number;
  reservaSuperior?: number;
  reservaInferior?: number;
  onStatus?: (estado: EstadoMapa) => void;
}
export function MapaGoogle({
  estacoes,
  selectedId,
  fadedIds = [],
  onSelectStation,
  altura = 520,
  reservaSuperior = 0,
  reservaInferior = 0,
  onStatus,
}: Props) {
  const ref = useRef<MapView | null>(null),
    [ready, setReady] = useState(false),
    { usuario } = usarAutenticacao(),
    { filters } = usarFiltros(),
    { colors } = usarTema(),
    keyConfigured = Constants.expoConfig?.extra?.hasGoogleMapsKey === true;
  const avisar = useRef(onStatus);
  avisar.current = onStatus;
  const visible = useMemo(
      () => estacoes.filter((s) => !fadedIds.includes(s.id)),
      [estacoes, fadedIds],
    ),
    selected = visible.find((s) => s.id === selectedId);
  const region = useMemo(() => {
    if (!visible.length)
      return {
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };
    const minLat = Math.min(...visible.map((s) => s.lat)),
      maxLat = Math.max(...visible.map((s) => s.lat)),
      minLng = Math.min(...visible.map((s) => s.lng)),
      maxLng = Math.max(...visible.map((s) => s.lng));
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(0.018, (maxLat - minLat) * 1.4),
      longitudeDelta: Math.max(0.018, (maxLng - minLng) * 1.4),
    };
  }, [visible]);
  /* A folha da tela mostra o estado numa linha curta; nada de aviso por cima do mapa. */
  useEffect(() => {
    avisar.current?.({ fase: !keyConfigured ? 'ilustrativo' : ready ? 'pronto' : 'carregando' });
  }, [keyConfigured, ready]);
  useEffect(() => {
    if (!ready) return;
    if (selected)
      ref.current?.animateToRegion(
        {
          latitude: selected.lat,
          longitude: selected.lng,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        },
        0,
      );
    else if (visible.length)
      ref.current?.fitToCoordinates(
        visible.map((s) => ({ latitude: s.lat, longitude: s.lng })),
        { edgePadding: { top: 50, right: 35, bottom: 35, left: 35 }, animated: false },
      );
  }, [selectedId, visible, ready]);
  /* Sem chave nativa: mapa ilustrativo direto, com os pinos entre a busca e a folha. */
  if (!keyConfigured)
    return (
      <MapaEstilizado
        estacoes={visible}
        selectedId={selectedId}
        onSelectStation={onSelectStation}
        altura={altura}
        reservaSuperior={reservaSuperior}
        reservaInferior={reservaInferior}
      />
    );
  if (!visible.length) return <View style={{ height: altura }} />;
  /* Mapa na área toda acima da folha; o mapPadding tira logo, controles e enquadramento de baixo da busca. */
  return (
    <View style={{ height: altura - reservaInferior }}>
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onMapReady={() => setReady(true)}
        mapPadding={{ top: reservaSuperior, right: 0, bottom: 0, left: 0 }}
        style={{ flex: 1 }}
      >
        {visible.map((s) => {
          const cs = conectoresCorrespondentes(s, filters, usuario?.tipoConector),
            status = statusDosConectores(cs);
          return (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.lat, longitude: s.lng }}
              title={s.name}
              description={cs.map((c) => `${c.type} · ${c.powerKw} kW`).join(' / ')}
              onPress={() => onSelectStation(s.id)}
              accessibilityLabel={`${s.name}, ${status === 'available' ? 'conector disponível' : status === 'busy' ? 'conector ocupado' : 'fora de serviço'}`}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor:
                    status === 'available'
                      ? colors.primaryDark
                      : status === 'busy'
                        ? '#8A5A05'
                        : '#665B77',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selectedId === s.id ? 4 : 2,
                  borderColor: selectedId === s.id ? colors.primary : '#FFFFFF',
                }}
              >
                <Texto style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
                  {s.id.replace('st-', '')}
                  {status === 'available' ? 'D' : status === 'busy' ? 'O' : 'F'}
                </Texto>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
