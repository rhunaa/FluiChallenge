import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Texto as Text } from '../componentes/Texto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { gradients, radius, spacing, typography } from '../tema/tema';
import { usarTema } from '../contexto/ContextoTema';
import { estacoes, buscarEstacaoPorId } from '../dados/estacoes';
import { CartaoEstacao } from '../componentes/CartaoEstacao';
import { usarReservas } from '../contexto/ContextoReservas';
import { usarAutenticacao } from '../contexto/ContextoAutenticacao';

function formatarHora(h: number): string {
  return `${String(h).padStart(2, '0')}h`;
}

export default function TelaInicio() {
  const navigation = useNavigation<any>();
  const { colors } = usarTema();
  const styles = criarEstilos(colors);
  const featured = estacoes.filter((s) => s.status === 'available').slice(0, 3);
  const { reservas } = usarReservas();
  const reservaAtiva = Object.values(reservas)[0];
  const estacaoReservada = reservaAtiva ? buscarEstacaoPorId(reservaAtiva.stationId) : undefined;
  const { usuario } = usarAutenticacao();
  const primeiroNome = usuario?.name?.split(' ')[0] ?? 'motorista';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting} allowFontScaling>
              Olá, {primeiroNome}
            </Text>
            <Text style={styles.title} allowFontScaling>
              Para onde vamos hoje?
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.getParent()?.navigate('Accessibility')}
            style={styles.avatar}
            accessibilityRole="button"
            accessibilityLabel="Abrir acessibilidade"
          >
            <Ionicons name="settings-outline" size={20} color={colors.onPrimary} />
          </Pressable>
        </Animated.View>

        {estacaoReservada && reservaAtiva && (
          <Animated.View entering={FadeInDown.delay(60).duration(400)}>
            <Pressable
              onPress={() => navigation.navigate('StationDetail', { stationId: estacaoReservada.id })}
              style={styles.reservaBanner}
              accessibilityRole="button"
              accessibilityLabel={`Reserva às ${formatarHora(reservaAtiva.startHour)} em ${estacaoReservada.name}`}
              accessibilityHint="Toque para ver a ficha do posto reservado"
            >
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.reservaBannerText} allowFontScaling numberOfLines={1}>
                Reserva às {formatarHora(reservaAtiva.startHour)} em {estacaoReservada.name}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <LinearGradient colors={gradients.hero} style={styles.hero}>
            <View style={styles.heroIconRing}>
              <Ionicons name="flash" size={26} color={colors.onPrimary} />
            </View>
            <Text style={styles.heroTitle} allowFontScaling>
              Encontre pontos de recarga por perto
            </Text>
            <Text style={styles.heroSubtitle} allowFontScaling>
              {estacoes.length} estações mapeadas na sua região agora
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Map')}
              style={styles.heroButton}
              accessibilityRole="button"
              accessibilityLabel="Ver mapa de pontos de recarga"
            >
              <Text style={styles.heroButtonText} allowFontScaling>
                Ver mapa
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(450)}>
          <Pressable
            onPress={() => navigation.navigate('TripPlanner')}
            style={styles.tripPlannerCard}
            accessibilityRole="button"
            accessibilityLabel="Planejar viagem"
            accessibilityHint="Calcula paradas de recarga para uma viagem mais longa"
          >
            <View style={styles.tripPlannerIcon}>
              <Ionicons name="navigate-circle-outline" size={26} color={colors.onPrimary} />
            </View>
            <View style={styles.tripPlannerInfo}>
              <Text style={styles.tripPlannerTitle} allowFontScaling>
                Planejar viagem
              </Text>
              <Text style={styles.tripPlannerSubtitle} allowFontScaling numberOfLines={1}>
                Calcule as paradas de recarga do seu trajeto
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header" allowFontScaling>
            Postos em destaque
          </Text>
          <Pressable onPress={() => navigation.navigate('Map')} accessibilityRole="button" accessibilityLabel="Ver todos os postos no mapa">
            <Text style={styles.link} allowFontScaling>
              Ver todos
            </Text>
          </Pressable>
        </View>

        {featured.map((station, i) => (
          <CartaoEstacao
            key={station.id}
            station={station}
            index={i}
            onPress={() => navigation.getParent()?.navigate('StationDetail', { stationId: station.id })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const criarEstilos = (colors: ReturnType<typeof usarTema>['colors']) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 140,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
  title: {
    ...typography.h1,
    color: colors.textOnDark,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reservaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  reservaBannerText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
    flex: 1,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroIconRing: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textOnGradient,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textOnGradientMuted,
    marginBottom: spacing.lg,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    gap: 6,
  },
  heroButtonText: {
    ...typography.bodyMedium,
    color: colors.primaryDark,
  },
  tripPlannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  tripPlannerIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tripPlannerInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  tripPlannerTitle: {
    ...typography.h3,
  },
  tripPlannerSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textOnDark,
  },
  link: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
});
