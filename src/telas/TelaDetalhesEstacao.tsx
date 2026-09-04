import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors, gradients, radius, shadow, spacing, typography } from '../tema/tema';
import { buscarEstacaoPorId } from '../dados/estacoes';
import { ROTULOS_COMODIDADE, ChaveComodidade } from '../tipos';
import { SeloStatus } from '../componentes/SeloStatus';
import { GraficoOcupacao } from '../componentes/GraficoOcupacao';
import { usarFavoritos } from '../contexto/ContextoFavoritos';

const AMENITY_ICONS: Record<ChaveComodidade, keyof typeof Ionicons.glyphMap> = {
  wifi: 'wifi-outline',
  cafe: 'cafe-outline',
  restroom: 'body-outline',
  shopping: 'bag-outline',
  food: 'fast-food-outline',
  parking: 'car-outline',
};

export default function TelaDetalhesEstacao() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { ehFavorito, alternarFavorito } = usarFavoritos();
  const station = buscarEstacaoPorId(route.params?.stationId);
  const saved = station ? ehFavorito(station.id) : false;

  if (!station) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound} allowFontScaling>
          Posto não encontrado.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <LinearGradient colors={gradients.hero} style={styles.hero}>
          <SafeAreaView edges={['top']} style={styles.heroSafe}>
            <View style={styles.heroTopRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Ionicons name="arrow-back" size={20} color={colors.onPrimary} />
              </Pressable>
              <Pressable
                onPress={() => alternarFavorito(station.id)}
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel={saved ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                accessibilityState={{ selected: saved }}
              >
                <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={colors.onPrimary} />
              </Pressable>
            </View>

            <Animated.View entering={FadeInDown.duration(400)}>
              <Text style={styles.stationName} accessibilityRole="header" allowFontScaling>
                {station.name}
              </Text>
              <Text style={styles.stationAddress} allowFontScaling>
                {station.address}
              </Text>
              <View style={styles.heroMetaRow}>
                <SeloStatus status={station.status} />
                <View style={styles.heroMetaChip}>
                  <Ionicons name="navigate" size={12} color={colors.onPrimary} />
                  <Text style={styles.heroMetaText}>{station.distanceKm} km</Text>
                </View>
                <View style={styles.heroMetaChip}>
                  <Ionicons name="star" size={12} color={colors.onPrimary} />
                  <Text style={styles.heroMetaText}>{station.rating.toFixed(1)}</Text>
                </View>
              </View>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.sheet}>
          <Animated.View entering={FadeInUp.delay(80).springify().damping(16)}>
            <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
              Carregadores disponíveis
            </Text>
            {station.connectors.map((connector) => (
              <View key={connector.id} style={styles.connectorRow}>
                <View style={styles.connectorIconBox}>
                  <Ionicons name="flash" size={18} color={colors.primary} />
                </View>
                <View style={styles.connectorInfo}>
                  <Text style={styles.connectorType} allowFontScaling>
                    {connector.type}
                  </Text>
                  <Text style={styles.connectorPower} allowFontScaling>
                    Potência até {connector.powerKw} kW
                  </Text>
                </View>
                <SeloStatus status={connector.status} />
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(140).springify().damping(16)} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
              Período de menor movimento
            </Text>
            <GraficoOcupacao hourlyOccupancy={station.hourlyOccupancy} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).springify().damping(16)} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
              Horário de funcionamento
            </Text>
            <View style={styles.hoursRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.hoursText} allowFontScaling>
                {station.openHours}
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(260).springify().damping(16)} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
              Comodidades próximas
            </Text>
            <View style={styles.amenitiesGrid}>
              {station.amenities.map((amenity) => (
                <View key={amenity} style={styles.amenityChip}>
                  <Ionicons name={AMENITY_ICONS[amenity]} size={16} color={colors.primaryDark} />
                  <Text style={styles.amenityLabel} allowFontScaling>
                    {ROTULOS_COMODIDADE[amenity]}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={[styles.ctaBar, shadow.floating]}>
        <Pressable
          onPress={() => Alert.alert('Navegação', `Rota até ${station.name} será aberta no app de mapas do dispositivo.`)}
          style={styles.ctaButton}
          accessibilityRole="button"
          accessibilityLabel={`Iniciar navegação até ${station.name}`}
        >
          <Ionicons name="navigate" size={18} color={colors.onPrimary} />
          <Text style={styles.ctaText} allowFontScaling>
            Iniciar navegação
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    ...typography.body,
    color: colors.textOnDark,
    padding: spacing.lg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroSafe: {
    paddingHorizontal: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationName: {
    ...typography.h1,
    color: colors.textOnDark,
  },
  stationAddress: {
    ...typography.body,
    color: colors.textOnDarkMuted,
    marginTop: 4,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  heroMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  heroMetaText: {
    ...typography.small,
    color: colors.textOnDark,
  },
  sheet: {
    backgroundColor: colors.background,
    marginTop: -spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: 160,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textOnDark,
    marginBottom: spacing.md,
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  connectorIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  connectorInfo: {
    flex: 1,
  },
  connectorType: {
    ...typography.bodyMedium,
  },
  connectorPower: {
    ...typography.caption,
    marginTop: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  hoursText: {
    ...typography.bodyMedium,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  amenityLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  ctaBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
  },
  ctaText: {
    ...typography.bodyMedium,
    color: colors.onPrimary,
  },
});
