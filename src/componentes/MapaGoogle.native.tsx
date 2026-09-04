import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../tema/tema';
import { Estacao } from '../tipos';

interface MapaGoogleProps {
  estacoes: Estacao[];
  selectedId: string | null;
  fadedIds: Set<string>;
  onSelectStation: (id: string) => void;
}

const STATUS_COLOR: Record<Estacao['status'], string> = {
  available: colors.primary,
  busy: colors.warning,
  offline: colors.offline,
};

function regionFromStations(estacoes: Estacao[]): Region {
  const lats = estacoes.map((s) => s.lat);
  const lngs = estacoes.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat, 0.02) * 1.4,
    longitudeDelta: Math.max(maxLng - minLng, 0.02) * 1.4,
  };
}

// Mapa real do Google Maps para iOS/Android. É preciso configurar a
// GOOGLE_MAPS_API_KEY (veja .env.example) e gerar um build nativo (o Expo Go
// não inclui esse módulo nativo) — na web, usa MapaGoogle.web.tsx.
export function MapaGoogle({ estacoes, selectedId, fadedIds, onSelectStation }: MapaGoogleProps) {
  const mapRef = useRef<MapView>(null);
  const initialRegion = useMemo(() => regionFromStations(estacoes), [estacoes]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      showsCompass={false}
      showsMyLocationButton={false}
      accessibilityLabel="Mapa de pontos de recarga"
    >
      {estacoes.map((station) => {
        const faded = fadedIds.has(station.id);
        const selected = selectedId === station.id;
        return (
          <Marker
            key={station.id}
            coordinate={{ latitude: station.lat, longitude: station.lng }}
            onPress={() => onSelectStation(station.id)}
            opacity={faded ? 0.35 : 1}
            tracksViewChanges={false}
            accessibilityLabel={`${station.name}, ${
              station.status === 'available' ? 'disponível' : station.status === 'busy' ? 'ocupada' : 'indisponível'
            }`}
            accessibilityHint="Toque para ver detalhes do ponto de recarga"
          >
            <View
              style={[
                styles.pin,
                { backgroundColor: STATUS_COLOR[station.status] },
                selected && styles.pinSelected,
              ]}
            >
              <Ionicons
                name={Math.max(...station.connectors.map((c) => c.powerKw)) >= 100 ? 'flash' : 'battery-charging'}
                size={16}
                color={colors.onPrimary}
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const PIN_SIZE = 32;

const styles = StyleSheet.create({
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pinSelected: {
    transform: [{ scale: 1.25 }],
  },
});
