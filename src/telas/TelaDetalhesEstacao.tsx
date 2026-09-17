import React, { useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { gradients, radius, shadow, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { buscarEstacaoPorId, obterMelhoresJanelas } from '../dados/estacoes';
import { locaisProximosPorEstacao } from '../dados/locaisProximos';
import { ROTULOS_COMODIDADE, ChaveComodidade } from '../tipos';
import { SeloStatus } from '../componentes/SeloStatus';
import { GraficoOcupacao } from '../componentes/GraficoOcupacao';
import { CartaoLocalProximo } from '../componentes/CartaoLocalProximo';
import { Chip } from '../componentes/Chip';
import { usarFavoritos } from '../contexto/ContextoFavoritos';
import { usarReservas } from '../contexto/ContextoReservas';

function formatarHora(h: number): string {
  return `${String(h).padStart(2, '0')}h`;
}

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
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const { ehFavorito, alternarFavorito } = usarFavoritos();
  const { reservaDaEstacao, criarReserva, cancelarReserva } = usarReservas();
  const station = buscarEstacaoPorId(route.params?.stationId);
  const saved = station ? ehFavorito(station.id) : false;
  const locaisProximos = station ? locaisProximosPorEstacao[station.id] ?? [] : [];
  const reserva = station ? reservaDaEstacao(station.id) : undefined;
  const janelas = station ? obterMelhoresJanelas(station.hourlyOccupancy) : [];
  const [janelaSelecionada, setJanelaSelecionada] = useState<number | null>(null);

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
        <ImageBackground source={{ uri: station.imageUrl }} style={styles.hero} imageStyle={styles.heroImage}>
          <LinearGradient colors={gradients.hero} style={styles.heroOverlay} />
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
                  <Text style={styles.heroMetaText} allowFontScaling>{station.distanceKm} km</Text>
                </View>
                <View style={styles.heroMetaChip}>
                  <Ionicons name="star" size={12} color={colors.onPrimary} />
                  <Text style={styles.heroMetaText} allowFontScaling>{station.rating.toFixed(1)}</Text>
                </View>
              </View>
            </Animated.View>
          </SafeAreaView>
        </ImageBackground>

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

          <Animated.View entering={FadeInUp.delay(170).springify().damping(16)} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
              Reservar horário de recarga
            </Text>
            {reserva ? (
              <View style={styles.reservaAtivaCard}>
                <View style={styles.reservaAtivaIcon}>
                  <Ionicons name="calendar" size={18} color={colors.onPrimary} />
                </View>
                <View style={styles.reservaAtivaInfo}>
                  <Text style={styles.reservaAtivaTitle} allowFontScaling>
                    Reserva confirmada
                  </Text>
                  <Text style={styles.reservaAtivaSubtitle} allowFontScaling>
                    {formatarHora(reserva.startHour)} – {formatarHora(reserva.endHour)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => cancelarReserva(station.id)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar reserva"
                >
                  <Ionicons name="close-circle-outline" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.reservaHelper} allowFontScaling>
                  Escolha um horário de baixo movimento e garanta sua vaga
                </Text>
                <View style={styles.reservaChipsRow}>
                  {janelas.map((janela) => (
                    <Chip
                      key={janela.start}
                      label={`${formatarHora(janela.start)} – ${formatarHora(janela.end)}`}
                      selected={janelaSelecionada === janela.start}
                      onPress={() => setJanelaSelecionada(janela.start)}
                    />
                  ))}
                </View>
                <Pressable
                  onPress={() => {
                    const janela = janelas.find((j) => j.start === janelaSelecionada);
                    if (janela) criarReserva(station.id, janela.start, janela.end);
                  }}
                  disabled={janelaSelecionada === null}
                  style={[styles.reservaConfirmarButton, janelaSelecionada === null && styles.reservaConfirmarButtonDisabled]}
                  accessibilityRole="button"
                  accessibilityLabel="Confirmar reserva de horário"
                  accessibilityState={{ disabled: janelaSelecionada === null }}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color={colors.onPrimary} />
                  <Text style={styles.reservaConfirmarText} allowFontScaling>
                    Confirmar reserva
                  </Text>
                </Pressable>
              </>
            )}
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

          {locaisProximos.length > 0 && (
            <Animated.View entering={FadeInUp.delay(260).springify().damping(16)} style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
                Enquanto você espera
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.esperaRow}
              >
                {locaisProximos.map((local, i) => (
                  <CartaoLocalProximo key={local.id} local={local} index={i} />
                ))}
              </ScrollView>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(320).springify().damping(16)} style={styles.section}>
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
          onPress={() => navigation.navigate('Tabs', { screen: 'Map' })}
          style={styles.ctaButton}
          accessibilityRole="button"
          accessibilityLabel="Iniciar navegação"
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

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
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
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  heroImage: {
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.82,
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
    color: colors.textOnGradient,
  },
  stationAddress: {
    ...typography.body,
    color: colors.textOnGradientMuted,
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
    color: colors.textOnGradient,
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
  esperaRow: {
    paddingRight: spacing.lg,
  },
  reservaHelper: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  reservaChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reservaConfirmarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  reservaConfirmarButtonDisabled: {
    backgroundColor: colors.offline,
  },
  reservaConfirmarText: {
    ...typography.bodyMedium,
    color: colors.onPrimary,
  },
  reservaAtivaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  reservaAtivaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  reservaAtivaInfo: {
    flex: 1,
  },
  reservaAtivaTitle: {
    ...typography.bodyMedium,
  },
  reservaAtivaSubtitle: {
    ...typography.caption,
    marginTop: 2,
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
