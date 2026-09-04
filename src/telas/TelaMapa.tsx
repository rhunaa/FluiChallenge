import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, radius, shadow, spacing, typography } from '../tema/tema';
import { estacoes } from '../dados/estacoes';
import { MapaGoogle } from '../componentes/MapaGoogle';
import { CartaoPreviaEstacao } from '../componentes/CartaoPreviaEstacao';
import { CarregandoMapa } from '../componentes/CarregandoMapa';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { aplicarFiltros, contarFiltrosAtivos } from '../utilitarios/filtrarEstacoes';

export default function TelaMapa() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { filters } = usarFiltros();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(route.params?.focusStationId ?? null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const visibleStations = useMemo(() => aplicarFiltros(estacoes, filters), [filters]);
  const visibleIds = useMemo(() => new Set(visibleStations.map((s) => s.id)), [visibleStations]);
  const fadedIds = useMemo(
    () => new Set(estacoes.filter((s) => !visibleIds.has(s.id)).map((s) => s.id)),
    [visibleIds],
  );
  const selectedStation = estacoes.find((s) => s.id === selectedId) ?? null;
  const activeFilterCount = contarFiltrosAtivos(filters);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <CarregandoMapa />
        </View>
      ) : (
        <MapaGoogle
          estacoes={estacoes}
          selectedId={selectedId}
          fadedIds={fadedIds}
          onSelectStation={(id) => setSelectedId(id)}
        />
      )}

      <SafeAreaView style={styles.topBar} edges={['top']} pointerEvents="box-none">
        <Animated.View entering={FadeIn.delay(150)} style={styles.searchRow}>
          <View style={[styles.searchBar, shadow.card]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <Text style={styles.searchPlaceholder} allowFontScaling>
              Buscar postos, endereços...
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Filters')}
            style={[styles.filterButton, shadow.card, activeFilterCount > 0 && styles.filterButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={`Filtros${activeFilterCount > 0 ? `, ${activeFilterCount} ativos` : ''}`}
          >
            <Ionicons name="options" size={18} color={activeFilterCount > 0 ? colors.onPrimary : colors.primary} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(220)} style={[styles.countPill, shadow.card]}>
          <Ionicons name="flash" size={13} color={colors.primary} />
          <Text style={styles.countText} allowFontScaling>
            {visibleStations.length} de {estacoes.length} pontos visíveis
          </Text>
        </Animated.View>
      </SafeAreaView>

      {selectedStation && (
        <CartaoPreviaEstacao
          station={selectedStation}
          onClose={() => setSelectedId(null)}
          onViewDetails={() => navigation.getParent()?.navigate('StationDetail', { stationId: selectedStation.id })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBase,
  },
  loadingWrap: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  countText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
