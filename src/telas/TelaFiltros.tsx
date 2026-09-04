import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, gradients, radius, spacing, typography } from '../tema/tema';
import { estacoes } from '../dados/estacoes';
import { ROTULOS_COMODIDADE, ChaveComodidade, TipoConector } from '../tipos';
import { Chip } from '../componentes/Chip';
import { AcaoRapida } from '../componentes/AcaoRapida';
import { SecaoFiltro } from '../componentes/SecaoFiltro';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { usarFiltros } from '../contexto/ContextoFiltro';
import { aplicarFiltros } from '../utilitarios/filtrarEstacoes';

const CONNECTOR_TYPES: TipoConector[] = ['CCS Combo2', 'CHAdeMO', 'Tipo 2', 'Tesla NACS'];
const POWER_OPTIONS = [22, 50, 100, 150];
const AMENITY_OPTIONS: ChaveComodidade[] = ['wifi', 'cafe', 'restroom', 'shopping', 'food', 'parking'];

const OBJECTIVES = [
  { key: 'home', icon: 'home-outline' as const, label: 'Chegar em casa', preset: {} },
  { key: 'fast', icon: 'flash-outline' as const, label: 'Recarga rápida', preset: { minPower: 100 } },
  { key: 'full', icon: 'battery-charging-outline' as const, label: 'Recarga completa', preset: { amenities: ['food', 'restroom'] as ChaveComodidade[] } },
  { key: 'comfort', icon: 'cafe-outline' as const, label: 'Local confortável', preset: { amenities: ['cafe', 'wifi'] as ChaveComodidade[] } },
];

export default function TelaFiltros() {
  const navigation = useNavigation<any>();
  const { filters, setFilters, resetarFiltros } = usarFiltros();
  const [objective, setObjective] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const results = useMemo(() => aplicarFiltros(estacoes, filters), [filters]);

  useEffect(() => {
    setAnalyzing(true);
    const t = setTimeout(() => setAnalyzing(false), 550);
    return () => clearTimeout(t);
  }, [filters]);

  function toggleConnector(type: TipoConector) {
    setObjective(null);
    setFilters({
      ...filters,
      connectorTypes: filters.connectorTypes.includes(type)
        ? filters.connectorTypes.filter((t) => t !== type)
        : [...filters.connectorTypes, type],
    });
  }

  function togglePower(power: number) {
    setObjective(null);
    setFilters({ ...filters, minPower: filters.minPower === power ? null : power });
  }

  function toggleAmenity(key: ChaveComodidade) {
    setObjective(null);
    setFilters({
      ...filters,
      amenities: filters.amenities.includes(key) ? filters.amenities.filter((a) => a !== key) : [...filters.amenities, key],
    });
  }

  function toggleHours(mode: 'any' | '24h' | 'commercial') {
    setObjective(null);
    setFilters({ ...filters, hoursMode: filters.hoursMode === mode ? 'any' : mode });
  }

  function selectObjective(o: (typeof OBJECTIVES)[number]) {
    setObjective(o.key);
    resetarFiltros();
    setFilters({
      connectorTypes: [],
      minPower: null,
      amenities: [],
      hoursMode: 'any',
      ...o.preset,
    });
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <Text style={styles.headerTitle} accessibilityRole="header" allowFontScaling>
            Filtros de Busca
          </Text>
          <Text style={styles.headerSubtitle} allowFontScaling>
            Qual seu objetivo agora?
          </Text>

          <View style={styles.objectivesRow}>
            {OBJECTIVES.map((o) => (
              <AcaoRapida
                key={o.key}
                icon={o.icon}
                label={o.label}
                selected={objective === o.key}
                onPress={() => selectObjective(o)}
              />
            ))}
          </View>

          {analyzing && (
            <Animated.View entering={FadeIn} style={styles.analyzingCard}>
              <Ionicons name="options" size={16} color={colors.onPrimary} />
              <Text style={styles.analyzingText} allowFontScaling>
                Atualizando resultados...
              </Text>
            </Animated.View>
          )}
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SecaoFiltro title="Tipo de conector" index={0}>
          {CONNECTOR_TYPES.map((type) => (
            <Chip key={type} label={type} selected={filters.connectorTypes.includes(type)} onPress={() => toggleConnector(type)} />
          ))}
        </SecaoFiltro>

        <SecaoFiltro title="Potência mínima" index={1}>
          {POWER_OPTIONS.map((p) => (
            <Chip key={p} label={`${p}+ kW`} selected={filters.minPower === p} onPress={() => togglePower(p)} />
          ))}
        </SecaoFiltro>

        <SecaoFiltro title="Comodidades" index={2}>
          {AMENITY_OPTIONS.map((a) => (
            <Chip key={a} label={ROTULOS_COMODIDADE[a]} selected={filters.amenities.includes(a)} onPress={() => toggleAmenity(a)} />
          ))}
        </SecaoFiltro>

        <SecaoFiltro title="Horário de funcionamento" index={3}>
          <Chip label="24 horas" selected={filters.hoursMode === '24h'} onPress={() => toggleHours('24h')} />
          <Chip label="Horário comercial" selected={filters.hoursMode === 'commercial'} onPress={() => toggleHours('commercial')} />
        </SecaoFiltro>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle} accessibilityRole="header" allowFontScaling>
            Resultados encontrados
          </Text>
          <Text style={styles.resultsCount} allowFontScaling>
            {results.length} {results.length === 1 ? 'posto' : 'postos'}
          </Text>
        </View>

        {results.length === 0 ? (
          <Animated.View entering={FadeInDown} style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText} allowFontScaling>
              Nenhum posto encontrado com esses filtros. Tente ajustar suas preferências.
            </Text>
          </Animated.View>
        ) : (
          results.map((station, i) => (
            <CartaoEstacao
              key={station.id}
              station={station}
              index={i}
              onPress={() => navigation.getParent()?.navigate('StationDetail', { stationId: station.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textOnDark,
    marginTop: spacing.sm,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  objectivesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyzingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  analyzingText: {
    ...typography.caption,
    color: colors.textOnDark,
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 140,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  resultsTitle: {
    ...typography.h3,
    color: colors.textOnDark,
  },
  resultsCount: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
  },
});
